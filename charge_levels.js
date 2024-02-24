
// Ruta al archivo JSON
const jsonPath = './levels.json';

// Función para cargar el archivo JSON y devolver los datos del nivel
export async function chargeLevel() {
  try {
    const response = await fetch(jsonPath);
    if (!response.ok) {
      throw new Error('Error');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}
