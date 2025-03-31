import { auth, db, storage } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

async function updateUser({ email, name, surname, phoneNumber, photo, finalEvent }) {
  const currentUser = auth.currentUser.uid;

  if (photo) {
    try {
      const storageRef = ref(storage, `images/${currentUser}${photo?.name || "0"}`);
      const snapshot = await uploadBytes(storageRef, photo);
      const url = await getDownloadURL(snapshot.ref);
      
      await updateDoc(doc(db, "Users", currentUser), {
        name,
        surname,
        email,
        phoneNumber: phoneNumber || "",
        photoUrl: url,
      });
      
      finalEvent?.();
    } catch (error) {
      console.error("Error updating user with photo:", error);
      throw error;
    }
  } else {
    try {
      await updateDoc(doc(db, "Users", currentUser), {
        name,
        surname,
        email,
        phoneNumber: phoneNumber || "",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

async function updatePasswordHelper({ currentPassword, newPassword }) {
  const currentUser = auth.currentUser;
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