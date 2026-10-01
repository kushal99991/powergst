import { onSnapshot, collection, getDocs } from "@firebase/firestore";
import { useEffect, useState } from "react";
import db from "./firebase";
function Message() {
  const [notification, setNotification] = useState([]);

  useEffect(
    () =>
      onSnapshot(collection(db, "PushNotification"), (snapshot) =>
        setNotification(
          snapshot.docChanges().map((change) => change.doc.data())
        )
      ),
    []
  );

  const fetchPost = async () => {
    await getDocs(collection(db, "PushNotification"))
      .then((querySnapshot) => {
        querySnapshot.docs.map((doc) => {
          console.log("doc1=", doc);
        });
      })
      .catch((error) => {
        console.log("error=", error);
      });
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div>
      <ul></ul>
    </div>
  );
}

export default Message;
