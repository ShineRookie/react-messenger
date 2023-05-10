import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from "../contexts/AuthContext";
import { db } from "../firebase";
import { ChatContext } from "../contexts/ChatContext";

const Chats = ({ setIsOpenedSidebar, isMobile }) => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChat", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (user) => {
    if (isMobile) setIsOpenedSidebar(false);
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className={"flex flex-col gap-1"}>
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            onClick={() => handleSelect(chat[1].userInfo)}
            key={chat[0]}
            className={`flex cursor-pointer items-center gap-4 
              rounded-[10px] bg-light p-[10px] transition-all hover:bg-lightHover dark:bg-dark dark:hover:bg-darkHover`}
          >
            <img
              src={chat[1].userInfo.photoURL}
              alt={"avatar"}
              className={"h-[50px] w-[50px] rounded-full object-cover"}
            />
            <div className={"flex w-full items-end justify-between"}>
              <div>
                <span>{chat[1].userInfo.displayName}</span>
                <p
                  className={
                    "max-w-[200px] overflow-hidden overflow-ellipsis whitespace-nowrap text-lightText/75 dark:text-darkText/75"
                  }
                >
                  {chat[1].lastMessage?.text}
                </p>
              </div>
              {/*<p className={"lastMessageTime"}></p>*/}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
