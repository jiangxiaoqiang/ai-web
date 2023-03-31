import Footer from "../component/footer/Footer";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Chat from "./chat/Chat";
import { IUserModel } from "js-wheel";
import "./Home.css";

const Home: React.FC = (props) => {

  const [currentPage, setCurrentPage] = useState("chat");
  const [userInfo, setUserInfo] = useState<IUserModel>();

  useEffect(() => {
    if (currentPage === 'profile') {
      if (!userInfo) {
        const storeUser = localStorage.getItem("userInfo");
        if (storeUser) {
          setUserInfo(JSON.parse(storeUser));
        }
      }
    }
  });

  return (
    <div id="home-root">
      <Chat menu={currentPage} onMenuClick={(value) => { setCurrentPage(value.toString()); }}></Chat>
      <Footer></Footer>
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  robot: state.robot
});

const mapDispatchToProps = (dispatch: any) => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

