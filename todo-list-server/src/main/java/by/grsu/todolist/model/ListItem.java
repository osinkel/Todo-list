package by.grsu.todolist.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Primary;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ListItem {
    @Id
    @Column(nullable = false)
    @GeneratedValue
    private Long id;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private String userId;
    private String text;
    private String status;

}
