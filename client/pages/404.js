import React, { useEffect } from "react";
import { useRouter } from "next/router";

const Notfound = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, [router]);
  return <></>;
};

export default Notfound;
