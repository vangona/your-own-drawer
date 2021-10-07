import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import Answer from "../components/Answer";
import Loading from "../components/Loading";
import { dbService } from "../fBase";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Writer = styled.div`
    width: 100%;
    text-align: center;
    font-size: 20px;
    color: white;
    font-family: Jeju myeongjo;
    margin-top: 50px;
    margin-bottom: 40px;
`;

const AddBtn = styled.button`
    background-color: transparent;
    border: 0;
    color: white;
    opacity: 0.7;
    padding: 15px 0;
    :hover {
        cursor: pointer;
    }
    :active {
        transform: scale(0.98);
    }
`;

const LastAnswer = styled.div`
    color: white;
    font-size: 12px;
    padding: 15px 0;
`;

const UserAnswers = ({userObj, refreshFriends}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState([]);
    const { id } = useParams();
    const [currentPage, setCurrentPage] = useState(1)

    const currentPosts = (posts) => {
        let currentPosts = 0;
        currentPosts = posts.slice(0, currentPage * 5)
        return currentPosts
      }
  
      const addPage = () => {
        setCurrentPage(currentPage + 1)
    }
    
    const getAnswers = async () => {
        await dbService.collection("answers").where("userId", "==", `${id}`).get()
        .then(snapShot => {
          const answerData = snapShot.docs.map(doc => ({
            ...doc.data()
          }))
          setAnswers(answerData)
          setIsLoading(false);
        }
        )
      }
    
      useEffect(() => {
        getAnswers();
      })

    return (
        <Container>
        {isLoading 
        ? <Loading />
        :
        <>
        <Writer>{answers[0].userName}의 대답들</Writer>
        {currentPosts(answers).map(answer => <Answer answer={answer} userObj={userObj} refreshFriends={refreshFriends} />)}
        {currentPage*5 <= answers.length 
        ?
        <AddBtn onClick={addPage}>
            <FontAwesomeIcon icon={faPlusCircle} size="2x" />
        </AddBtn>
        : <LastAnswer>
            마지막 대답입니다.
        </LastAnswer>
        }
        </>
        }
      </Container>
    )
}

export default UserAnswers;