package ru.kata.spring.boot_security.demo.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class AppRestController {
    private final RoleService roleService;
    private final UserService userService;

    @Autowired
    public AppRestController(RoleService roleService, UserService userService) {
        this.roleService = roleService;
        this.userService = userService;
    }

    @GetMapping("/user")
    public ModelAndView index(Model model, Principal principal) {
        ModelAndView mav = new ModelAndView("user");
        User user = userService.findOne(principal.getName());
        model.addAttribute("user", user);
        return mav;
    }

    @GetMapping("/admin")
    public ModelAndView startPage(ModelMap model, Principal principal) {
        ModelAndView admin = new ModelAndView("admin");
        User user = userService.findOne(principal.getName());
        model.addAttribute("user", user);
        model.addAttribute("allUsers", userService.findAll());
        model.addAttribute("roleUser", roleService.getRoles());
        return admin;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return users != null && !users.isEmpty()
                ? new ResponseEntity<>(userService.findAll(), HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable("id") int id) {
        User user = userService.findOne(id);
        return user != null
                ? new ResponseEntity<>(user, HttpStatus.OK)
                : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        Set<Role> roleList = roleService.getRoles();
        return ResponseEntity.ok(roleList.stream().toList());
    }

    @PostMapping("/users")
    public ResponseEntity<HttpStatus> saveNewUser(@RequestBody User user) {
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        userService.save(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PutMapping("/users")
    public ResponseEntity<HttpStatus> updateUser(@RequestBody User user) {
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        userService.update(user);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") int id) {
        userService.delete(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }
}
