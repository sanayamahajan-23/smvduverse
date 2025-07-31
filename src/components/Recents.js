// components/Recents.js
import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Recents = ({ user, onSelectRecent }) => {
  const [recents, setRecents] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchRecents = async () => {
      try {
        const q = query(
          collection(db, "users", user.uid, "recents"),
          orderBy("timestamp", "desc"),
          limit(20)
        );
        const snapshot = await getDocs(q);
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecents(list);
      } catch (err) {
        console.error("Error fetching recents:", err);
      }
    };

    fetchRecents();
  }, [user]);

  return (
    <div style={{ padding: "16px" }}>
      <h2 className="text-xl font-semibold mb-4">Recent Searches</h2>
      {recents.length === 0 ? (
        <p>No recent searches.</p>
      ) : (
        <ul className="space-y-2">
          {recents.map((place, index) => (
            <li
              key={index}
              onClick={() => onSelectRecent(place)}
              style={{
                padding: "8px 12px",
                background: "#f7f7f7",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#eaeaea")
              }
              onMouseOut={(e) => (e.currentTarget.style.background = "#f7f7f7")}
            >
              {place.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Recents;
