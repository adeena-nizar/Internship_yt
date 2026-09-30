"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import { useUser } from "@/context/UserContext";

const PartyPage = () => {
  const { partyId } = useParams();
  const { socket } = useSocket();
  const { user } = useUser();
  const [participants, setParticipants] = useState({});

  useEffect(() => {
    if (socket && user) {
      console.log("User object:", user);
      socket.emit("join-party", { partyId, user });

      socket.on("participants-update", (newParticipants) => {
        setParticipants(newParticipants);
      });
    }

    return () => {
      if (socket) {
        socket.off("participants-update");
      }
    };
  }, [socket, user, partyId]);

  return (
    <div>
      <h1>Watch Party: {partyId}</h1>
      <h2>Participants</h2>
      <ul>
        {Object.values(participants).map((p: any) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PartyPage;