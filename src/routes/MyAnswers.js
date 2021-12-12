import { faChevronLeft, faEdit, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Answer from "../components/Answer";
import Loading from "../components/Loading";
import { dbService } from "../fBase";

const Container = styled.div`
    display: flex;
    padding-top: 30px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    height: 100%;
    width: 100%;
    margin-top: 20px;
    box-sizing: border-box;
`;

const Title = styled.div`
    margin: 20px;
    display: flex;
    color: white;
    font-size: 1.5rem;
    font-family: Kyobo Handwriting;
    flex-direction: column;
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
    font-size: 0.7rem;
    padding: 15px 0;
`;

const WriteBtn = styled.button`
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    font-family: Kyobo Handwriting;
    background: none;
    border: none;
    color: white;
    font-size: 0.9rem;
    :hover {
        cursor: pointer;
    }
`

const MyAnswers = ({userObj}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [myAnswers, setMyAnswers] = useState(null);
    const [currentPage, setCurrentPage] = useState(1)

    const currentPosts = (posts) => {
        let currentPosts = 0;
        currentPosts = posts.slice(0, currentPage * 5)
        return currentPosts
      }

      const addPage = () => {
        if (currentPage*5 >= myAnswers.length) {
            getMyAnswers();
          }
        setCurrentPage(currentPage + 1)
    }

    const getMyAnswers = async () => {
        await dbService.collection("answers").where("userId", "==", `${userObj.uid}`).orderBy("createdAt").limitToLast(currentPage*5 + 10).get()
        .then(snapshot => {
            const myAnswerArray = snapshot.docs.map(doc => ({
                id: doc.answerId,
                ...doc.data()    
            }))
            myAnswerArray.sort((a, b) => {
                if(a.createdAt > b.createdAt) return -1;
                if(a.createdAt === b.createdAt) return 0;
                if(a.createdAt < b.createdAt) return 1;
              });
            setMyAnswers(myAnswerArray)
            setIsLoading(!isLoading)
        })
    }

    useEffect(()=>{
        getMyAnswers();
    }, [])

    return (
        <Container>
            {isLoading 
            ? <Loading />
            : ( 
            <>
                <Title>
                    나만의 서랍장
                </Title>
                {currentPosts(myAnswers).map(myAnswer => <Answer key={myAnswer.answerId} answer={myAnswer} userObj={userObj}/>)}
                {currentPage*5 <= myAnswers.length 
                ?
                <AddBtn onClick={addPage}>
                    <FontAwesomeIcon icon={faPlusCircle} size="2x" />
                </AddBtn>
                : <LastAnswer>
                    마지막 대답입니다.
                </LastAnswer>
                }
                <Link to={"/questions"} style={{textDecoration: "none"}}>
                <WriteBtn>
                    <FontAwesomeIcon icon={faEdit} />
                    답변쓰기
                </WriteBtn>
                </Link>
            </>
            )}
        </Container>
    );
  }
  
  export default MyAnswers;
  