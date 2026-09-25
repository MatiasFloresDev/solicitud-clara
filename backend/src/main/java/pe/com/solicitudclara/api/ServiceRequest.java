package pe.com.solicitudclara.api;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "service_requests")
public class ServiceRequest {
    public enum Status { RECIBIDA, EN_ANALISIS, LISTA_PARA_DESARROLLO }

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String clientName;
    @Column(nullable = false, length = 100)
    private String company;
    @Column(nullable = false, length = 160)
    private String email;
    @Column(nullable = false, length = 60)
    private String serviceType;
    @Column(nullable = false, length = 140)
    private String title;
    @Column(nullable = false, length = 4000)
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private Status status = Status.RECIBIDA;
    @Column(length = 4000)
    private String requirements = "";
    @Column(length = 4000)
    private String acceptanceCriteria = "";
    @Column(nullable = false)
    private Instant createdAt = Instant.now();
    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    protected ServiceRequest() {}

    public ServiceRequest(String clientName, String company, String email, String serviceType, String title, String description) {
        this.clientName = clientName;
        this.company = company;
        this.email = email;
        this.serviceType = serviceType;
        this.title = title;
        this.description = description;
    }

    public Long getId() { return id; }
    public String getClientName() { return clientName; }
    public String getCompany() { return company; }
    public String getEmail() { return email; }
    public String getServiceType() { return serviceType; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public Status getStatus() { return status; }
    public String getRequirements() { return requirements; }
    public String getAcceptanceCriteria() { return acceptanceCriteria; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }

    public void startAnalysis() {
        if (status != Status.RECIBIDA) throw new IllegalStateException("Solo una solicitud recibida puede iniciar análisis.");
        status = Status.EN_ANALISIS;
        updatedAt = Instant.now();
    }

    public void saveAnalysis(String requirements, String acceptanceCriteria) {
        if (status != Status.EN_ANALISIS) throw new IllegalStateException("La solicitud debe estar en análisis.");
        this.requirements = requirements.trim();
        this.acceptanceCriteria = acceptanceCriteria.trim();
        updatedAt = Instant.now();
    }

    public void markReady() {
        if (status != Status.EN_ANALISIS) throw new IllegalStateException("La solicitud debe estar en análisis.");
        if (requirements.isBlank() || acceptanceCriteria.isBlank())
            throw new IllegalStateException("Agrega requisitos y criterios de aceptación antes de finalizar el análisis.");
        status = Status.LISTA_PARA_DESARROLLO;
        updatedAt = Instant.now();
    }
}
