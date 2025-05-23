// Updated UserDto.java to include weight and height
package com.aviDB.api.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Base64;

@Getter
@Setter
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Integer balance;
    private byte[] avatar;
    private Boolean isAdmin;
    private String avatarBase64;
    
    // Add personal info fields
    private String first;
    private String last;
    private String weight;
    private String height;

    /**
     * Utility method to convert avatar bytes to base64 string
     * @param avatarBytes The raw avatar bytes from the database
     */
    public void setAvatarFromBytes(byte[] avatarBytes) {
        if (avatarBytes != null) {
            this.avatarBase64 = Base64.getEncoder().encodeToString(avatarBytes);
        }
    }
}