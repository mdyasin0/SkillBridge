"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChallengeWorkspace from "../page";
import { useAuth } from "@/context/AuthContext";


export default function WorkspacePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  if (!user?.id || !id) return;

  fetch(
    `/api/coding_challenge-manage/all_coding_challenge/${id}?userId=${user.id}`
  )
    .then((res) => res.json())
    .then((res) => {
      setChallenge(res.data);
      setLoading(false);
    });
}, [id, user]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <ChallengeWorkspace challenge={challenge} />;
}