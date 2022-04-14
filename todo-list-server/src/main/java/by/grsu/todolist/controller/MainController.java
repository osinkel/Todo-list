package by.grsu.todolist.controller;

import by.grsu.todolist.Constants;
import by.grsu.todolist.model.ListItem;
import by.grsu.todolist.repository.ListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MainController {

    private final ListRepository listRepository;

    @GetMapping("/list")
    public ResponseEntity<?> getList(@PathParam("name") String name, @PathParam("userId") String userId) {
        if (name == null || name.length() == 0) {
            return new ResponseEntity<>("You should send list name by parameter \"name\"", HttpStatus.BAD_REQUEST);
        }
        if (userId == null || userId.length() == 0) {
            return new ResponseEntity<>("User id parameter (userId) is required", HttpStatus.BAD_REQUEST);
        }
        switch (name) {
            case Constants.IN_PROGRESS:
            case Constants.COMPLETED:
            case Constants.REMOVED:
                List<ListItem> itemList = listRepository.getListByUserIdAndStatus(userId, name);
                return new ResponseEntity<>(itemList, HttpStatus.OK);
            default:
                return new ResponseEntity<>("Available list names: " + Constants.IN_PROGRESS + " " + Constants.COMPLETED + " " + Constants.REMOVED, HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/task")
    public ResponseEntity<?> createTask(@PathParam("text") String text, @PathParam("userId") String userId) {
        if (text == null || text.length() == 0) {
            return new ResponseEntity<>("Text length parameter (text) should be greater than 0.", HttpStatus.BAD_REQUEST);
        }
        if (userId == null || userId.length() == 0) {
            return new ResponseEntity<>("User id parameter (userId) is required", HttpStatus.BAD_REQUEST);
        }
        ListItem listItem = new ListItem();
        listItem.setText(text);
        listItem.setUserId(userId);
        listItem.setStatus(Constants.IN_PROGRESS);
        return new ResponseEntity<>(listRepository.save(listItem), HttpStatus.OK);
    }

    @PutMapping("/task")
    public ResponseEntity<?> updateTask(@PathParam("userId") String userId, @PathParam("taskId") long taskId, @PathParam("status") String status) {
        if (userId == null || userId.length() == 0) {
            return new ResponseEntity<>("User id parameter (userId) is required", HttpStatus.BAD_REQUEST);
        }
        if (status == null || status.length() == 0) {
            return new ResponseEntity<>("Status parameter (status) is required", HttpStatus.BAD_REQUEST);
        }
        if (!status.equals(Constants.IN_PROGRESS) && !status.equals(Constants.COMPLETED) && !status.equals(Constants.REMOVED)) {
            return new ResponseEntity<>("Available statuses: " + Constants.IN_PROGRESS + " " + Constants.COMPLETED + " " + Constants.REMOVED, HttpStatus.BAD_REQUEST);
        }

        ListItem listItem = listRepository.findById(taskId).orElse(null);
        if (listItem == null) {
            return new ResponseEntity<>("Task with id: " + taskId + " not found.", HttpStatus.NOT_FOUND);
        }
        if (!listItem.getUserId().equals(userId)) {
            return new ResponseEntity<>("This user cannot access selected task", HttpStatus.FORBIDDEN);
        }
        listItem.setStatus(status);
        return new ResponseEntity<>(listRepository.save(listItem), HttpStatus.OK);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteTask(@PathParam("userId") String userId, @PathParam("taskId") long taskId) {
        if (userId == null || userId.length() == 0) {
            return new ResponseEntity<>("User id parameter (userId) is required", HttpStatus.BAD_REQUEST);
        }

        ListItem listItem = listRepository.findById(taskId).orElse(null);
        if (listItem == null) {
            return new ResponseEntity<>("Task with id: " + taskId + " not found.", HttpStatus.NOT_FOUND);
        }
        if (!listItem.getUserId().equals(userId)) {
            return new ResponseEntity<>("This user cannot access selected task", HttpStatus.FORBIDDEN);
        }
        listRepository.delete(listItem);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
