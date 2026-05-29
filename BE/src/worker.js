const { Client } = require("pg")
const { BlobServiceClient } = require("@azure/storage-blob")

async function main() {
  const jobStartTime = Date.now()

  const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 5432,
    ssl: {
      rejectUnauthorized: false
    }
  })

  try {

    // =========================
    // PostgreSQL
    // =========================

    console.log("Connecting to PostgreSQL...")

    await client.connect()

    console.log("Connected to PostgreSQL")

    // =========================
    // Query employees
    // =========================

    console.log("Fetching employees data...")


    const result = await client.query(
      "SELECT * FROM employees"
    )

    const employees = result.rows

    // =========================
    // Build export payload
    // =========================


    const exportData = {
      generated_at: new Date().toISOString(),

      total_employees: employees.length,
      employees
    }

    const jsonData = JSON.stringify(
      exportData,
      null,
      2
    )

    const fileSizeKB =
      Buffer.byteLength(jsonData) / 1024

    console.log(
      `JSON file size: ${fileSizeKB.toFixed(
        2
      )} KB`
    )

    // =========================
    // Azure Blob Storage
    // =========================

    console.log("Connecting to Blob Storage...")

    const blobServiceClient =
      BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION
      )

    const containerName = "job-results"

    const containerClient =
      blobServiceClient.getContainerClient(
        containerName
      )

    // Create container if not exists
    await containerClient.createIfNotExists()

    console.log(
      `Using container: ${containerName}`
    )

    // =========================
    // Blob upload
    // =========================

    const blobName = "employees.json"

    const blockBlobClient =
      containerClient.getBlockBlobClient(
        blobName
      )

    console.log(
      `Uploading ${blobName}...`
    )

    const uploadStartTime = Date.now()

    await blockBlobClient.upload(
      jsonData,
      Buffer.byteLength(jsonData),
      {
        overwrite: true
      }
    )

    const uploadEndTime = Date.now()

    const uploadDuration =
      uploadEndTime - uploadStartTime

    console.log(
      `Upload completed in ${uploadDuration} ms`
    )

    console.log(
      `${blobName} uploaded successfully`
    )

    // =========================
    // Job summary
    // =========================

    const finalDuration =
      Date.now() - jobStartTime

    console.log("===================================")

    console.log("JOB SUMMARY")

    console.log(
      `Employees count: ${employees.length}`
    )

    console.log(
      `Query duration: ${queryDuration} ms`
    )

    console.log(
      `Upload duration: ${uploadDuration} ms`
    )

    console.log(
      `Total duration: ${finalDuration} ms`
    )

    console.log(
      `File size: ${fileSizeKB.toFixed(
        2
      )} KB`
    )

    console.log(
      "End time:",
      new Date().toISOString()
    )

    console.log("===================================")
  } catch (err) {
    console.error("===================================")
    console.error("Job failed")
    console.error(err)
    console.error("===================================")

    process.exitCode = 1
  } finally {
    await client.end()

    console.log(
      "PostgreSQL connection closed"
    )
  }
}

main()