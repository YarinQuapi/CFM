import React, { useState, useEffect } from "react";
import { FiX, FiUser, FiMail, FiShield } from "react-icons/fi";
import { User } from "../../types";
import { userService } from "../../services/userService";
import toast from "react-hot-toast";
import styles from "./UserModal.module.css";

interface UserModalProps {
  user?: User | null;
  onClose: () => void;
  onSave: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    displayName: "",
    email: "",
    role: "viewer" as User["role"],
    isActive: true,
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        password: "",
        confirmPassword: "",
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.displayName.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.displayName.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!user && !formData.password) {
      newErrors.password = "Password is required for new users";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        displayName: formData.displayName,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
      };

      if (user) {
        await userService.updateUser(user.id, userData);
        toast.success("User updated successfully");
      } else {
        await userService.createUser({
          ...userData,
          password: formData.password,
        } as any);
        toast.success("User created successfully");
      }
      onSave();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const roleOptions = [
    {
      value: "0",
      label: "Viewer",
      description: "Can view servers and files",
    },
    {
      value: "1",
      label: "Editor",
      description: "Can manage servers and files",
    },
    {
      value: "2",
      label: "Super Admin",
      description: "Full system access",
    },
  ];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.icon}>
              <FiUser />
            </div>
            <h2 className={styles.title}>
              {user ? "Edit User" : "Add New User"}
            </h2>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            
            <div className={styles.formGroup}>
              <label className="form-label" htmlFor="username">
                <FiUser className={styles.labelIcon} />
                Display Name *
              </label>
              <input
                id="displayName"
                type="text"
                className={`input-base ${
                  errors.username ? styles.inputError : ""
                }`}
                placeholder="Enter display name"
                value={formData.displayName}
                onChange={(e) => handleInputChange("displayName", e.target.value)}
                disabled={loading}
              />
              {errors.username && (
                <span className={styles.errorMessage}>{errors.username}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className="form-label" htmlFor="email">
                <FiMail className={styles.labelIcon} />
                Email *
              </label>
              <input
                id="email"
                type="email"
                className={`input-base ${
                  errors.email ? styles.inputError : ""
                }`}
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={loading}
              />
              {errors.email && (
                <span className={styles.errorMessage}>{errors.email}</span>
              )}
            </div>

<div className={styles.formGroup}>
              <label className="form-label" htmlFor="username">
                <FiUser className={styles.labelIcon} />
                First Name *
              </label>
              <input
                id="firstName"
                type="text"
                className={`input-base ${
                  errors.firstName ? styles.inputError : ""
                }`}
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                disabled={loading}
              />
              {errors.username && (
                <span className={styles.errorMessage}>{errors.username}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className="form-label" htmlFor="username">
                <FiUser className={styles.labelIcon} />
                Last Name *
              </label>
              <input
                id="lastName"
                type="text"
                className={`input-base ${
                  errors.lastName ? styles.inputError : ""
                }`}
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                disabled={loading}
              />
              {errors.username && (
                <span className={styles.errorMessage}>{errors.username}</span>
              )}
            </div>

          </div>

          <div className={styles.formGroup}>
            <label className="form-label" htmlFor="role">
              <FiShield className={styles.labelIcon} />
              Role *
            </label>
            <div className={styles.roleSelector}>
              {roleOptions.map((option) => (
                <div
                  key={option.value}
                  className={`${styles.roleOption} ${
                    formData.role === option.value ? styles.selected : ""
                  }`}
                  onClick={() =>
                    handleInputChange("role", option.value as User["role"])
                  }
                >
                  <div className={styles.roleHeader}>
                    <span className={styles.roleLabel}>{option.label}</span>
                    <div className={styles.roleRadio}>
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={formData.role === option.value}
                        onChange={() =>
                          handleInputChange(
                            "role",
                            option.value as User["role"]
                          )
                        }
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <p className={styles.roleDescription}>{option.description}</p>
                </div>
              ))}
            </div>
          </div>

          {!user && (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className="form-label" htmlFor="password">
                  Password *
                </label>
                <input
                  id="password"
                  type="password"
                  className={`input-base ${
                    errors.password ? styles.inputError : ""
                  }`}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  disabled={loading}
                />
                {errors.password && (
                  <span className={styles.errorMessage}>{errors.password}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm Password *
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`input-base ${
                    errors.confirmPassword ? styles.inputError : ""
                  }`}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  disabled={loading}
                />
                {errors.confirmPassword && (
                  <span className={styles.errorMessage}>
                    {errors.confirmPassword}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className={styles.formGroup}>
            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                  disabled={loading}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Active user</span>
              </label>
              <p className={styles.checkboxDescription}>
                Inactive users cannot log in to the system
              </p>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className="btn-base btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn-base btn-primary ${
                loading ? styles.loading : ""
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.spinner}></div>
                  Saving...
                </>
              ) : user ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
