import React, { useState, useEffect } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import "./RankFlow.css";
import { usePerson } from "../../../COMPONENTS/Context";
import { useNavigate } from "react-router-dom";
import MainFlow from "../../Flows/MainFlow/Flows";
import Default from "../../Default/Admin";

export default function RankFlow({ viewConnectionIndex, handlecancelviewconnections }) {
  const { selectedPersonId } = usePerson();
  const [mainConnection, setMainConnection] = useState(null);
  const [mainflows, setmainflows] = useState(false);
  const [selectedSubPersonId, setSelectedSubPersonId] = useState(null);

  useEffect(() => {
    if (selectedPersonId) {
      fetchMainConnection(selectedPersonId);
    }
  }, [selectedPersonId]);

  const fetchMainConnection = async (selectedPersonId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/personalinfo/main/${selectedPersonId}`
      );
      const data = await response.json();
      setMainConnection(data);
    } catch (error) {
      console.error("Error fetching main connection:", error);
    }
  };

  const navigate = useNavigate();

  const handleClickSubconnection = (subPersonId) => {
    const SubConnectionsid = subPersonId;
    navigate("../dashboard", {
      state: { subConnectionsidvalue: SubConnectionsid },
    });
    setmainflows(!mainflows);
    setSelectedSubPersonId(subPersonId);
  };

  const renderNode = (connection, index) => (
    <div
      className="node child"
      // onClick={() => handleClickSubconnection(connection.person_id)}
    >
      <div className={`rectangle rectangle${index}`}>
        <div className="line"></div>
        <div className="account-container">
          <img
            src={`${process.env.REACT_APP_API}${connection.profile}`}
            alt="image"
            className="account"
          />
          <div className="rank-details">
            <div className="text-item-name">
              {connection.fullname || "Name"}
            </div>
            <div className="text-item-profession">
              {connection.address || "Profession"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubNodes = (personId) => {
    return <SubConnections personId={personId} />;
  };

  return (
    <div style={{ height: "76vh" }}>
      {!mainflows ? (
        <div className="rank-flow">
          <div>
            <div style={{ display: "flex" }}>
              {/* <i
                className="fa-solid fa-arrow-left"
                alt="cancel-img"
                style={{
                  fontSize: "18px",
                  width: "5%",
                  marginTop: "2%",
                  cursor: "pointer",
                  marginLeft: "3%",
                }}
                onClick={handlecancelviewconnections}
              /> */}
              <p className="rank-connections" style={{ marginLeft: "75%" }}>
                {/* &nbsp;Connections {viewConnectionIndex} */}
              </p>
            </div>
            {mainConnection && (
              <Tree
                lineColor="grey"
                lineStyle="dashed"
                lineWidth="2px"
                lineHeight="30px"
                label={renderNode(mainConnection, 0)}
              >
                {renderSubNodes(mainConnection.person_id)}
              </Tree>
            )}
          </div>
          <div style={{ display: "none" }}>
            <Default subPersonId={selectedSubPersonId}></Default>
          </div>
        </div>
      ) : (
        <MainFlow subPersonId={selectedSubPersonId}></MainFlow>
      )}
    </div>
  );
}

function SubConnections({ personId }) {
  const [subConnections, setSubConnections] = useState([]);

  useEffect(() => {
    fetchSubConnections(personId);
  }, [personId]);

  const fetchSubConnections = async (personId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/personalinfo/subconnections/${personId}`
      );
      const data = await response.json();
      setSubConnections(data);
    } catch (error) {
      console.error("Error fetching sub-connections:", error);
    }
  };

  const renderNode = (connection) => {
    let rectangleClass = "";
  
    switch (connection.rank) {
      case 0:
        rectangleClass = "rectangle1";
        break;
      case 1:
        rectangleClass = "rectangle2";
        break;
      case 2:
        rectangleClass = "rectangle3";
        break;
      case 3:
        rectangleClass = "rectangle4";
        break;
      default:
        rectangleClass = "rectangle"; // Default class if no rank matches
        break;
    }
  
    return (
      <div className="node child">
        <div className={`rectangle ${rectangleClass}`}>
          <div className="line"></div>
          <div className="account-container">
            <img
              src={`${process.env.REACT_APP_API}${connection.profile}`}
              alt="image"
              className="account"
            />
            <div className="rank-details">
              <div className="text-item-name">
                {connection.fullname || "Name"}
              </div>
              <div className="text-item-profession">
                {connection.address || "Profession"}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

  const renderRecursive = (connections, index) => {
    if (index >= connections.length) return null;

    return (
      <TreeNode
        key={connections[index].person_id}
        label={renderNode(connections[index], index + 1)}
      >
        {index + 3 < connections.length &&
          renderRecursive(connections, index + 3)}
      </TreeNode>
    );
  };

  return subConnections.slice(0, 3).map((connection, index) => (
    <TreeNode
      key={connection.person_id}
      label={renderNode(connection, index + 1)}
    >
      {renderRecursive(subConnections, 3 + index)}
    </TreeNode>
  ));
}
