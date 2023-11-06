const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp()
const db = admin.firestore();
exports.setCustomClaims = functions.https.onCall(async (data, context) => {
  if (!context.auth || !context.auth.token.admin) {
    return { error: 'Permission denied' }
  }

  const userId = data.userId // The UID of the user you want to set custom claims for
  const role = data.role // The role you want to assign (e.g., 'normal' or 'volunteer')
  console.log(`Setting custom claims for user: ${userId}`)
  console.log(`Role: ${role}`)

  try {
    // Set custom claims for the user
    await admin.auth().setCustomUserClaims(userId, { role })
    console.log(`Custom claims updated for user: ${userId}`)
    return { success: `Custom claims updated for user: ${userId}` }
  } catch (error) {
    console.error('Error setting custom claims:', error)
    return { error: `Error setting custom claims: ${error.message}` }
  }
})

exports.matchTaskToVolunteer = functions.firestore
    .document('tasks/{taskId}')
    .onCreate(async (snap, context) => {
        const task = snap.data();
        const taskLocation = task.location; // Adjust to your task schema
        const maxDistance = 10; // Max distance for matching in kilometers

        const volunteersRef = db.collection('volunteer');
        const volunteersSnapshot = await volunteersRef.get();

        const matchedVolunteers = [];

        volunteersSnapshot.forEach((doc) => {
            const volunteer = doc.data();
            const volunteerLocation = volunteer.location; // Adjust to your volunteer schema

            // Calculate distance or use any other matching criteria
            const distance = calculateDistance(taskLocation, volunteerLocation);

            if (distance <= maxDistance) {
                matchedVolunteers.push(volunteer);
            }
        });

        // Do something with matched volunteers (e.g., update the task document)
        try {
            // Update the task document with matched volunteers
            await db.collection('tasks').doc(taskId).update({
              // You can update the task document with information about the matched volunteers.
              matched: true,
              volunteers: matchedVolunteers, // Store volunteer information here.
            });
        
            return { success: 'Task matched with volunteers successfully.' };
          } catch (error) {
            console.error('Error matching volunteers:', error);
            return { error: 'Error matching volunteers.' };
          }
    });
