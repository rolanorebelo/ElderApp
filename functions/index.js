const functions = require('firebase-functions')
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')

admin.initializeApp()
const db = admin.firestore()
const app = express()
app.use(cors({ origin: true }))

// Define an endpoint to add an event
app.post('/addEvent', async (req, res) => {
  try {
    const eventData = req.body

    // Perform validation and add the event data to Firestore
    const eventRef = await db.collection('events').add(eventData)

    res.status(201).json({ id: eventRef.id })
  } catch (error) {
    console.error('Error adding event:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Define an endpoint to set custom claims
app.post('/setCustomClaims', async (req, res) => {
  try {
    const { uid, customClaims } = req.body

    // Set the custom claims for the user
    await admin.auth().setCustomUserClaims(uid, customClaims)

    res.status(200).json({ message: 'Custom claims set successfully' })
  } catch (error) {
    console.error('Error setting custom claims:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.post('/getAvailableVolunteers', async (req, res) => {
  try {
    const { userLocation } = req.body
    console.log('user location----', userLocation)
    const volunteersRef = db.collection('volunteer')
    const volunteersSnapshot = await volunteersRef.get()
    const volunteersData = []
    volunteersSnapshot.forEach((volunteerDoc) => {
      const volunteer = volunteerDoc.data()
      const volunteerLatitude = volunteer.location.latitude
      const volunteerLongitude = volunteer.location.longitude
      console.log('Volunteer Lat', volunteerLatitude)
      console.log('Volunteer Long', volunteerLongitude)
      // Calculate distance between user and volunteer (in miles)
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        volunteerLatitude,
        volunteerLongitude
      )

      console.log(`Distance from User: ${distance} miles`)
      // Add volunteer to the list if within 5 miles and available
      if (distance <= 5 && volunteer.available === 'free') {
        volunteersData.push({
          uid: volunteerDoc.id,
          name: `${volunteer.firstName} ${volunteer.lastName}`,
          ratePerHour: volunteer.ratePerHour,
          profilePic: volunteer.profilePicture
        })
      }
    })

    console.log('Available Volunteers:', volunteersData)

    res.status(200).json(volunteersData)
  } catch (error) {
    console.error('Error getting available volunteers:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Notify new invoice endpoint
app.post('/notify-new-invoice', async (req, res) => {
  try {
    const { userId, invoiceId } = req.body

    await admin.firestore().collection('notifications').add({
      userId: userId,
      message: 'You have a new invoice. Go to "Completed Tasks" to check.',
      timestamp: new Date(),
      type: 'invoice',
      entityId: invoiceId
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error notifying new invoice:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Notify task status update endpoint
app.post('/notify-task-status-update', async (req, res) => {
  try {
    const { userId, taskId, status } = req.body

    await admin.firestore().collection('notifications').add({
      userId: userId,
      message: `Task status update: ${status}`,
      timestamp: new Date(),
      type: 'task',
      entityId: taskId
    })

    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error notifying task status update:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance (lat1, lon1, lat2, lon2) {
  const R = 3959 // Radius of the Earth in miles

  const toRadians = (angle) => (Math.PI / 180) * angle

  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = R * c // Distance in miles

  return distance
}
// Deploy the Express app as separate Firebase Functions
exports.api = functions.https.onRequest(app)
exports.setCustomClaims = functions.https.onRequest(app)
