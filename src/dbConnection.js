
import * as firebase from 'firebase'

firebase.initializeApp({
  apiKey: 'AIzaSyDxak8TY07SQtXjNPqar-k4B0dHARLcOXk',
  authDomain: 'buspark-28d97.firebaseapp.com',
  databaseURL: 'https://buspark-28d97.firebaseio.com',
  projectId: 'buspark-28d97',
  storageBucket: 'buspark-28d97.appspot.com',
  messagingSenderId: '483801286531',
  appId: '1:483801286531:web:2ce1e46a79479179'
})

export default firebase.database()
