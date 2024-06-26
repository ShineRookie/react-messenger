import { useContext, useEffect, useState } from "react";
import Chat from "../components/chat/Chat";
import Sidebar from "../components/sidebar/Sidebar";
import { AuthContext } from "../contexts/AuthContext";
import WithoutVerification from "../components/WithoutVerification";
import Loading from "../components/Loading";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Home = () => {
  const { currentUser } = useContext(AuthContext);
  const [isOpenedSidebar, setIsOpenedSidebar] = useState(true);
  const [verified, setVerified] = useState(currentUser.emailVerified);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        setVerified(true);
      }
    });

    return () => unSub();
  }, []);

  if (verified === undefined) {
    return <Loading />;
  }

  return (
    <div
      className={
        "bg-light font-bold text-lightText dark:bg-dark dark:text-darkText"
      }
    >
      {verified ? (
        <div className={"flex"}>
          <Sidebar
            isOpenedSidebar={isOpenedSidebar}
            setIsOpenedSidebar={setIsOpenedSidebar}
          />
          <Chat
            isOpenedSidebar={isOpenedSidebar}
            setIsOpenedSidebar={setIsOpenedSidebar}
          />
        </div>
      ) : (
        <WithoutVerification />
      )}
    </div>
  );
};

export default Home;
