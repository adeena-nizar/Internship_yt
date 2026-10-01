"use client";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { useParams } from "next/navigation";
import { useSocket } from "@/context/SocketContext";
import { UserContext } from "@/context/UserContext";

const PartyPage = () => {
  const params = useParams();
  const partyId = params?.partyId as string;
  const { socket } = useSocket();
  const context = useContext(UserContext);
  const user = context?.user;
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