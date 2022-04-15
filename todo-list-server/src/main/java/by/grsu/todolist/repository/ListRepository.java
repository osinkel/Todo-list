package by.grsu.todolist.repository;

import by.grsu.todolist.model.ListItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface ListRepository extends CrudRepository<ListItem, Long> {

    List<ListItem> getListByUserIdAndStatus(String userId, String status);

}
