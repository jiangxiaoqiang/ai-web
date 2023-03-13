import { Avatar, Button, Card, Col, Dropdown, Menu, Row } from "antd";
import Footer from "../component/footer/Footer";
import React, { useState } from "react";
import { connect } from "react-redux";
import GenieHeader from "../component/header/GenieHeader";
import Chat from "./chat/Chat";
import Goods from "./goods/Goods";

const Home: React.FC = (props) => {

  const [currentPage, setCurrentPage] = useState("chat");

  const handleMenuClick = (menu:string) => {
    renderBody(menu);
  };

  const renderChat=()=>{
    return (<Chat></Chat>);
  }


  const renderAccountBuy=()=>{
      return(
        <div>    
            <Goods></Goods>
        </div>
        );
  }

  const renderBody=(menu: string)=>{
    if(menu === "chat"){
      return renderChat();
    }
    if(menu === "account"){
      return renderAccountBuy();
    }
    if(menu === "about"){
      return (<div>about</div>);
    }
    return (<div></div>);
  }


    return(<div>
      <GenieHeader onMenuClick = { (value) =>{
        setCurrentPage(value.toString());
      }}/>
      <div className="content">
        {renderBody(currentPage)}
      </div>
      <Footer></Footer>
    </div>);

}

const mapStateToProps = (state: any) => ({
    robot: state.robot
  });
  
  const mapDispatchToProps = (dispatch: any) => {
    return {
      
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Home);
  
