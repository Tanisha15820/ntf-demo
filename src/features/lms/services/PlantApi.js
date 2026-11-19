import { mockPlants, mockDepartments } from "../../../data/mockStore";

const PlantApi = {
  // Get all plants
  getPlants: () => mockPlants.getPlants(),

  // Create a plant
  createPlant: (plantData) => mockPlants.createPlant(plantData),

  // Get one plant
  getPlant: (plantId) => mockPlants.getPlant(plantId),

  // Update a plant
  updatePlant: (plantId, plantData) =>
    mockPlants.updatePlant(plantId, plantData),

  // Delete a plant
  deletePlant: (plantId) => mockPlants.deletePlant(plantId),

  // Get departments by plant
  getDepartmentsByPlant: (plantId) =>
    mockDepartments.getDepartmentsByPlant(plantId),
};

export default PlantApi;
