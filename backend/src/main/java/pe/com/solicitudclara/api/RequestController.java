package pe.com.solicitudclara.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class RequestController {
    private final ServiceRequestRepository repository;

    public RequestController(ServiceRequestRepository repository) { this.repository = repository; }

    public record CreateInput(
        @NotBlank @Size(max = 100) String clientName,
        @NotBlank @Size(max = 100) String company,
        @NotBlank @Email @Size(max = 160) String email,
        @NotBlank @Size(max = 60) String serviceType,
        @NotBlank @Size(max = 140) String title,
        @NotBlank @Size(max = 4000) String description
    ) {}

    public record AnalysisInput(
        @NotBlank @Size(max = 4000) String requirements,
        @NotBlank @Size(max = 4000) String acceptanceCriteria
    ) {}

    @GetMapping
    public List<ServiceRequest> list() {
        return repository.findAll().stream()
            .sorted(Comparator.comparing(ServiceRequest::getUpdatedAt).reversed())
            .toList();
    }

    @GetMapping("/{id}")
    public ServiceRequest get(@PathVariable Long id) { return find(id); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceRequest create(@Valid @RequestBody CreateInput input) {
        return repository.save(new ServiceRequest(input.clientName().trim(), input.company().trim(),
            input.email().trim(), input.serviceType().trim(), input.title().trim(), input.description().trim()));
    }

    @PostMapping("/{id}/analysis")
    public ServiceRequest startAnalysis(@PathVariable Long id) {
        ServiceRequest request = find(id);
        request.startAnalysis();
        return repository.save(request);
    }

    @PutMapping("/{id}/analysis")
    public ServiceRequest saveAnalysis(@PathVariable Long id, @Valid @RequestBody AnalysisInput input) {
        ServiceRequest request = find(id);
        request.saveAnalysis(input.requirements(), input.acceptanceCriteria());
        return repository.save(request);
    }

    @PostMapping("/{id}/ready")
    public ServiceRequest markReady(@PathVariable Long id) {
        ServiceRequest request = find(id);
        request.markReady();
        return repository.save(request);
    }

    private ServiceRequest find(Long id) {
        return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada."));
    }

    @ExceptionHandler(IllegalStateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ErrorResponse conflict(IllegalStateException error) { return new ErrorResponse(error.getMessage()); }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse invalid() { return new ErrorResponse("Revisa los campos obligatorios, la longitud del texto y el formato del correo."); }

    public record ErrorResponse(String message) {}
}
