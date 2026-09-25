package pe.com.solicitudclara.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:request-flow-test;DB_CLOSE_DELAY=-1",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
@AutoConfigureMockMvc
class RequestFlowTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    @Test
    void requestNeedsDocumentedAnalysisBeforeItIsReady() throws Exception {
        String create = """
            {"clientName":"Ana Pérez","company":"Panadería Ana","email":"ana@ejemplo.com",
             "serviceType":"Comercio digital","title":"Pedidos en línea",
             "description":"Necesito recibir pedidos en línea y confirmar el total."}
            """;
        String response = mvc.perform(post("/api/requests").contentType(MediaType.APPLICATION_JSON).content(create))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.status").value("RECIBIDA"))
            .andReturn().getResponse().getContentAsString();
        JsonNode created = mapper.readTree(response);
        long id = created.get("id").asLong();

        mvc.perform(post("/api/requests/{id}/ready", id)).andExpect(status().isConflict());
        mvc.perform(post("/api/requests/{id}/analysis", id))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("EN_ANALISIS"));
        mvc.perform(post("/api/requests/{id}/ready", id)).andExpect(status().isConflict());

        mvc.perform(put("/api/requests/{id}/analysis", id).contentType(MediaType.APPLICATION_JSON)
            .content("{\"requirements\":\"El cliente agrega productos.\",\"acceptanceCriteria\":\"El total se calcula correctamente.\"}"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.requirements").value("El cliente agrega productos."));
        mvc.perform(post("/api/requests/{id}/ready", id))
            .andExpect(status().isOk()).andExpect(jsonPath("$.status").value("LISTA_PARA_DESARROLLO"));
        mvc.perform(get("/api/requests/{id}", id)).andExpect(status().isOk())
            .andExpect(jsonPath("$.acceptanceCriteria").value("El total se calcula correctamente."));
    }

    @Test
    void rejectsInvalidRequest() throws Exception {
        mvc.perform(post("/api/requests").contentType(MediaType.APPLICATION_JSON)
            .content("{\"clientName\":\"\",\"company\":\"Panadería\",\"email\":\"correo-invalido\",\"serviceType\":\"Web\",\"title\":\"Pedidos\",\"description\":\"Prueba\"}"))
            .andExpect(status().isBadRequest());
    }
}
