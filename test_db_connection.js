const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
  console.log('Testing database connection...')
  try {
    // Try a simple query
    const count = await prisma.heroSettings.count()
    console.log('Connection successful! HeroSettings count:', count)
  } catch (error) {
    console.error('Connection failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()
