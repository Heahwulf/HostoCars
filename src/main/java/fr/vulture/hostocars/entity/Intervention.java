package fr.vulture.hostocars.entity;

import static javax.persistence.GenerationType.IDENTITY;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.io.Serializable;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.EqualsAndHashCode.Include;

/**
 * Entity for the {@code interventions} table.
 */
@Entity
@Data
@Table(name = "interventions")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
class Intervention implements Serializable {

    private static final long serialVersionUID = -9130046034547531677L;

    @Id
    @Include
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "id", unique = true, nullable = false, insertable = false, updatable = false, columnDefinition = "INTEGER")
    private Integer id;

    @Column(name = "year", insertable = false, updatable = false, columnDefinition = "INTEGER")
    private Integer year;

    @Column(name = "number", insertable = false, updatable = false, columnDefinition = "INTEGER")
    private Integer number;

    @Column(name = "status", nullable = false, columnDefinition = "TEXT")
    private String status;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "mileage", columnDefinition = "INTEGER")
    private Integer mileage;

    @Column(name = "estimatedTime", columnDefinition = "REAL")
    private Double estimatedTime;

    @Column(name = "realTime", columnDefinition = "REAL")
    private Double realTime;

    @Column(name = "amount", columnDefinition = "REAL")
    private Double amount;

    @Column(name = "paidAmount", columnDefinition = "REAL")
    private Double paidAmount;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "carId", referencedColumnName = "id")
    private Car car;

    @JsonManagedReference
    @OneToMany(mappedBy = "intervention", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    private Set<Operation> operations;

}
