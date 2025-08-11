// src/dto/user.dto.js
class UserDTO {
    constructor(user) {
        this.id = user._id || user.id;  // Asegurar que el ID esté incluido
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.role = user.role;
        // NO incluir password, tokens, o datos sensibles
    }
}

module.exports = UserDTO;
