import { auth, db, storage } from "../config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

async function updateUser({ email, name, surname, phoneNumber, photo, finalEvent }) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.error("No authenticated user found");
    throw new Error("No authenticated user found");
  }
  
  console.log("Current user UID:", currentUser.uid);

  try {
    const userDoc = doc(db, "Users", currentUser.uid);
    const userSnap = await getDoc(userDoc);
    
    console.log("User document exists:", userSnap.exists());
    console.log("User document data:", userSnap.data());
    
    if (!userSnap.exists()) {
      console.error("User document not found");
      throw new Error("User document not found");
    }

    if (photo) {
      try {
        console.log("Uploading photo to storage");
        const storageRef = ref(storage, `images/${currentUser.uid}${photo?.name || "0"}`);
        const snapshot = await uploadBytes(storageRef, photo);
        const url = await getDownloadURL(snapshot.ref);
        
        console.log("Photo uploaded, updating user document");
        await updateDoc(userDoc, {
          name,
          surname,
          email,
          phoneNumber: phoneNumber || "",
          photoUrl: url,
        });
        
        console.log("User document updated with photo");
        finalEvent?.();
      } catch (error) {
        console.error("Error updating user with photo:", error);
        throw error;
      }
    } else {
      try {
        console.log("Updating user document without photo");
        await updateDoc(userDoc, {
          name,
          surname,
          email,
          phoneNumber: phoneNumber || "",
        });
        console.log("User document updated successfully");
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    }
  } catch (error) {
    console.error("Error in updateUser function:", error);
    throw error;
  }
}

async function updatePasswordHelper({ currentPassword, newPassword }) {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("No authenticated user found");
  }

  const credential = EmailAuthProvider.credential(
    currentUser.email,
    currentPassword
  );

  const reauth = async () => {
    try {
      await reauthenticateWithCredential(currentUser, credential);
    } catch (error) {
      console.error("Reauthentication error:", error);
      throw error;
    }
  };

  const update = async () => {
    try {
      await updatePassword(currentUser, newPassword);
    } catch (error) {
      console.error("Password update error:", error);
      throw error;
    }
  };

  return {
    reauth,
    update,
  };
}

export { updateUser, updatePasswordHelper as updatePassword };
