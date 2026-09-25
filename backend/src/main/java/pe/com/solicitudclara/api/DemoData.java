package pe.com.solicitudclara.api;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DemoData {
    @Bean
    CommandLineRunner seedRequests(ServiceRequestRepository repository) {
        return args -> {
            if (repository.count() > 0) return;

            ServiceRequest cafe = new ServiceRequest("Lucía Torres", "Café del Parque", "lucia@ejemplo.com",
                "Comercio digital", "Pedidos por WhatsApp con catálogo",
                "Recibimos pedidos por mensajes sueltos y perdemos detalles. Queremos un catálogo sencillo que genere un resumen del pedido para enviarlo por WhatsApp.");
            cafe.startAnalysis();
            cafe.saveAnalysis("El cliente puede ver productos con precio y disponibilidad.\nEl cliente puede agregar productos y ajustar cantidades.\nEl sistema genera un mensaje de WhatsApp con el resumen y total.",
                "Dado un catálogo con productos disponibles, cuando el cliente agrega dos unidades, el carrito muestra cantidad 2 y el subtotal correcto.\nAl confirmar, se abre WhatsApp con nombres, cantidades y total del pedido.");
            repository.save(cafe);

            ServiceRequest taller = new ServiceRequest("Diego Rojas", "Taller Norte", "diego@ejemplo.com",
                "Sistema interno", "Seguimiento de órdenes de reparación",
                "Hoy registramos las reparaciones en una libreta. Necesitamos consultar el estado de cada equipo y avisar al cliente cuando esté listo.");
            taller.startAnalysis();
            taller.saveAnalysis("El técnico registra una orden con cliente, equipo y falla.\nEl técnico cambia el estado a en diagnóstico, en reparación o listo.\nEl personal busca órdenes por número o cliente.",
                "Al crear una orden, el sistema asigna un número único.\nAl cambiar el estado a listo, la orden aparece en la lista de entregas pendientes.");
            taller.markReady();
            repository.save(taller);

            repository.save(new ServiceRequest("Mariana Salas", "Estudio Salas", "mariana@ejemplo.com",
                "Sitio web", "Web de presentación para estudio jurídico",
                "Queremos mostrar servicios, equipo y un formulario de contacto. Debe funcionar bien en celular y permitir actualizar el contenido con facilidad."));
        };
    }
}
