import * as ImagePicker from "expo-image-picker";

// ⚠️ Reemplaza estos valores con los tuyos de Cloudinary
const CLOUD_NAME = "dtqqmrw5i";
const UPLOAD_PRESET = "la_pampa";

class CloudinaryService {
  /**
   * Pedir permisos de cámara
   */
  async pedirPermisoCamara() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === "granted";
  }

  /**
   * Pedir permisos de galería
   */
  async pedirPermisoGaleria() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  }

  /**
   * Abrir galería y devolver la imagen seleccionada
   * @returns {Promise<Object|null>} { uri, base64 } o null si canceló
   */
  async seleccionarDeGaleria() {
    const permiso = await this.pedirPermisoGaleria();
    if (!permiso) {
      return { error: "Permiso de galería denegado" };
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled) return null;
    return result.assets[0];
  }

  /**
   * Abrir cámara y devolver la foto tomada
   * @returns {Promise<Object|null>} { uri, base64 } o null si canceló
   */
  async tomarFoto() {
    const permiso = await this.pedirPermisoCamara();
    if (!permiso) {
      return { error: "Permiso de cámara denegado" };
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (result.canceled) return null;
    return result.assets[0];
  }

  /**
   * 
   @param {string} base64
   @returns {Promise<Object>}
   */

  async subirImagen(base64) {
    try {
      const formData = new FormData();
      formData.append("file", `data:image/jpeg;base64,${base64}`);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", "lapampa/menu");

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.secure_url) {
        return { exito: true, url: data.secure_url };
      } else {
        console.error("❌ Cloudinary error:", data);
        return { exito: false, error: "Error al subir la imagen" };
      }
    } catch (error) {
      console.error("❌ Error subiendo imagen:", error);
      return { exito: false, error: error.message };
    }
  }
}

export default new CloudinaryService();
