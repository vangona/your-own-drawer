import React from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import { authService } from "utils/fBase";
import { useState } from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import TermModal from "./TermModal";


const Container = styled(animated.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 9;
`;

const AuthConatiner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const LoginContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  color: white;
  transition: 0.5s all ease-in-out;
  :focus-within {
    color: var(--gold);
  }
`;

const LoginLabel = styled.label`
  width: 70px;
  margin-right: 5px;
`;

const LoginInput = styled.input`
    transition: 0.3s all ease-in-out;
    :focus {
      border-radius: 10px;
    }    
`;

const Notice = styled.span`
  margin: 10px;
  color: white;
  font-size: 0.7rem;
`;

const Terms = styled.a`
  text-decoration: underline;
  :hover {
    cursor: pointer;
  }
`;

const LoginBtn = styled.button`
  color: var(--gold);
  background-color: transparent;
  border: 1px solid var(--gold);
  padding : 3px 10px;
  border-radius: 10px;
  margin-top: 10px;
  font-size: 0.9rem;
  font-family: Kyobo Handwriting;
  transition: 0.5s all ease-in-out;
    :hover {
        cursor: pointer;
        border: 1px solid white;
        color: white;
    }
    :active {
      transform: scale(0.9);
    }
`;

const PasswordContainer = styled.div`
  color: white;
  transition: 0.5s all ease-in-out;
  :focus-within {
    color: var(--gold);
  }
`;

const PasswordLabel = styled.label`
  width: 70px;
  margin-right: 5px;
`;

const PasswordInput = styled.input`
    transition: 0.3s all ease-in-out;
    :focus {
      border-radius: 10px;
    }   
`;

const PasswordBtn = styled.div`
  color: white;
  opacity: 70%;
  padding: 7px;
  margin: 10px 0 20px 0;
  font-size: 0.8rem;
  border: 1px solid;
  border-radius: 10px;
  transition: all 0.5s ease-in-out;
  :hover {
    cursor: pointer;
    color: var(--gold);
  }
`;

const Error = styled(animated.span)`
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  color: var(--gold);
  word-break: keep-all;
  width: 80%;
  font-size: 0.7rem;
`;

const Login = ({setCodeState, codeState}) => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.signInWithEmailAndPassword(
      code, codeState ? password : code) 
      setCode("");
    } catch (error) {
      if (error.message === "The email address is badly formatted.") {
        setError("????????? ??????????????????.")
      } else if (error.message === "There is no user record corresponding to this identifier. The user may have been deleted.") {
        setError("????????? ????????? ??????????????? ??????????????????.")
      }
      else {
        setError(error.message)
      }
    }
  }

  const onChange = e => {
    setCode(e.target.value)
  }

  const onChangePassword = e => {
    setPassword(e.target.value)
  }


  const closeModal = (e) => {
    setModalState(e);
}

  const animation = useSpring({
      from : {
          opacity : 0
      },
      to: {
          opacity: 1
      },
      config: config.gentle
  })

  const errorAni = useSpring({
    opacity: error ? 1 : 0,
    config: config.gentle
  })

  return (
    <Container style={animation}>
      {modalState && <TermModal closeModal={closeModal} />}
      <PasswordBtn onClick={() => {
        setCodeState(!codeState)
      }}>
        {codeState 
        ? "?????? ??????????????? ????????????" 
        : "?????? ??????????????? ????????????"
        }
      </PasswordBtn>
      <AuthConatiner>
        <LoginContainer>
          <LoginLabel style={{width: !codeState && "auto"}}>Code :</LoginLabel>
          <LoginInput onChange={onChange} value={code} type="text" />
        </LoginContainer>
        {codeState && 
          <PasswordContainer>
            <PasswordLabel>Password :</PasswordLabel>
            <PasswordInput value={password} onChange={onChangePassword} type="password" />
          </PasswordContainer>
        }
      </AuthConatiner>
      <Error style={errorAni}>{error}</Error>
      {code && 
      <>
        <Notice>
          ????????? ?????? <Terms onClick={() => {setModalState(true)}}>????????????</Terms>??? ???????????????.
        </Notice>
        <LoginBtn onClick={onSubmit}>
            ????????????
        </LoginBtn>
      </>
      }
    </Container>
  );
}

export default Login;
  