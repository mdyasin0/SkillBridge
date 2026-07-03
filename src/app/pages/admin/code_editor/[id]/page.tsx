"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChallengeWorkspace from "../page";


export default function WorkspacePage() {
  const { id } = useParams();

  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/coding_challenge-manage/all_coding_challenge/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setChallenge(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return <ChallengeWorkspace challenge={challenge} />;
}