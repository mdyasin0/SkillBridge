"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ChallengeWorkspace from "../page";
import { useAuth } from "@/context/AuthContext";
import LoadingUI from "@/components/Loadinui";

export default function WorkspacePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user?.id || !id) return;

    fetch(
      `/api/developer_coding-challenge/all-coding-challenge/${id}?userId=${user.id}`,
    )
      .then((res) => res.json())
      .then((res) => {
        setChallenge(res.data);
        setLoading(false);
      });
  }, [id, user]);

  if (loading) {
    return (
 <LoadingUI/>
    );
  }

  return <ChallengeWorkspace challenge={challenge} />;
}
