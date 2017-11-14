import firebase from 'firebase';
import { firebaseConfig } from '../../config.js';

const valid = firebaseConfig  && firebaseConfig.apiKey && firebaseConfig.projectId;

firebase.initializeApp(firebaseConfig);
const firebaseAuth = firebase.auth;
class FirebaseHelper {
  isValid = valid;
  EMAIL = 'email';
  FACEBOOK = 'facebook';
  GOOGLE = 'google';
  GITHUB = 'github';
  TWITTER = 'twitter';
  constructor() {
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }
  login(provider, info) {
    switch (provider) {
      case this.EMAIL:
        return firebaseAuth().signInWithEmailAndPassword(
          info.email,
          info.password
        );
      case this.FACEBOOK:
        return firebaseAuth().FacebookAuthProvider();
      case this.GOOGLE:
        return firebaseAuth().GoogleAuthProvider();
      case this.GITHUB:
        return firebaseAuth().GithubAuthProvider();
      case this.TWITTER:
        return firebaseAuth().TwitterAuthProvider();
      default:
    }
  }
  logout() {
    return firebaseAuth().signOut();
  }

  isAuthenticated() {
    firebaseAuth().onAuthStateChanged(user => {
      return user ? true : false;
    });
  }
  resetPassword(email) {
    return firebaseAuth().sendPasswordResetEmail(email);
  }
}

export default new FirebaseHelper();
