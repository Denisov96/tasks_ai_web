import { prisma } from ". /db";
const tasks = [{ text: "Buy milk" }, { text: "Repair computer" }];

async function seedData() {
  console.log("Seeding...");
  for (const task of tasks) {
    const result = await prisma.task.create({
      data: task,
    });
    console.log("Created task with id: ${result.id}");
  }
  console.log("Finished seeding.");
}
try {
  await seedData();
} catch (error) {
  console.error(error);
}
