import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../../component/LoginProvider";

export function MemberManage() {
  const [member, setMember] = useState(null);

  const toast = useToast();

  const { isOpen, onClose, onOpen } = useDisclosure();

  const navigate = useNavigate();

  const { isAuthenticated, fetchLogin } = useContext(LoginContext);

  // 버튼 css
  const buttonStyle = {
    background: "black",
    color: "whitesmoke",
    shadow: "1px 1px 3px 1px #dadce0",
    _hover: {
      backgroundColor: "whitesmoke",
      color: "black",
      transition:
        "background 0.5s ease-in-out, color 0.5s ease-in-out, box-shadow 0.5s ease-in-out",
      shadow: "1px 1px 3px 1px #dadce0 inset",
    },
  };

  // FormLabel 스타일
  const formLabelStyle = {
    width: "100px",
    height: "50px",
    lineHeight: "50px",
    fontSize: "1.1rem",
    fontWeight: "500",
  };

  // readonly input 스타일
  const readOnlyStyle = {
    style: {
      boxShadow: "1px 1px 3px 2px #dadce0 inset",
      width: "600px",
      height: "50px",
      borderRadius: "6px",
      textIndent: "15px",
      fontSize: "16px",
    },
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    } else {
      axios.get("/api/member/memberInfo").then((response) => {
        setMember(response.data);
      });
    }
  }, [isAuthenticated]);

  if (member == null) {
    return <Spinner />;
  }

  if (!isAuthenticated()) {
    return null;
  }

  // 회원 탈퇴 버튼 클릭
  function handleMemberDeleteClick() {
    // 탈퇴 처리 로직 실행
    axios
      .delete("/api/member")
      .then(() =>
        toast({ description: "회원자격을 상실 하셨습니다.", status: "error" }),
      )
      .then(() => navigate("/"))
      .catch(() =>
        toast({
          description: "탈퇴 처리중 문제가 발생하였습니다.",
          colorScheme: "gray",
        }),
      );

    // 탈퇴처리 완료 후 로그아웃 처리
    axios
      .post("/api/member/logout")
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        toast({
          description: "로그 아웃 중 문제가 발생하였습니다.",
          status: "error",
        });
      })
      .finally(() => fetchLogin());
  }

  return (
    <Center>
      <Card w={"700px"}>
        <CardHeader
          textAlign={"left"}
          lineHeight={"70px"}
          fontSize={"1.7rem"}
          fontWeight={"bold"}
        >
          <Flex>
            <Box fontSize={"1.8rem"} color={"#E87F06"}>
              {member.member_name}
            </Box>
            <Box>님 정보 입니다.</Box>
          </Flex>
        </CardHeader>
        <CardBody>
          {/* 프로필 사진 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>프로필 사진</FormLabel>

              <img
                src={member.memberImageDto.file_url}
                style={{
                  borderRadius: "100%",
                  blockSize: "250px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
                }}
                alt={member.memberImageDto.file_name}
              />
            </Flex>
            {member.memberImageDto.image_type === "default" && (
              <FormHelperText ml={"110px"}>기본 이미지 입니다.</FormHelperText>
            )}
          </FormControl>

          {/* 이름 */}
          <FormControl mt={6}>
            <Flex>
              <FormLabel {...formLabelStyle}>이름</FormLabel>
              <input {...readOnlyStyle} readOnly value={member.member_name} />
            </Flex>
          </FormControl>

          {/* 아이디 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>아이디</FormLabel>
              <input
                {...readOnlyStyle}
                readOnly
                value={member.member_login_id}
              />
            </Flex>
          </FormControl>

          {/* 휴대폰 번호 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>휴대폰번호</FormLabel>
              <input
                {...readOnlyStyle}
                readOnly
                value={member.member_phone_number}
              />
            </Flex>
          </FormControl>

          {/* 이메일 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>이메일</FormLabel>
              <input {...readOnlyStyle} readOnly value={member.member_email} />
            </Flex>
          </FormControl>

          {/* 우편번호 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>우편번호</FormLabel>
              <input
                {...readOnlyStyle}
                readOnly
                value={member.memberAddressDto.member_post_code}
              />
            </Flex>
          </FormControl>

          {/* 주소 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>주소</FormLabel>
              <input
                {...readOnlyStyle}
                readOnly
                value={member.memberAddressDto.member_address}
              />
            </Flex>
          </FormControl>

          {/* 상세 주소 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>상세주소</FormLabel>
              <input
                {...readOnlyStyle}
                readOnly
                value={member.memberAddressDto.member_detail_address}
              />
            </Flex>
          </FormControl>

          {/* 자기 소개 */}
          <FormControl mt={4}>
            <Flex>
              <FormLabel {...formLabelStyle}>자기소개</FormLabel>
              {member.member_introduce.length !== 0 ? (
                <textarea
                  style={{
                    boxShadow: "1px 1px 3px 2px #dadce0 inset",
                    width: "600px",
                    height: "150px",
                    borderRadius: "6px",
                    textIndent: "15px",
                    fontSize: "16px",
                    paddingTop: "15px",
                  }}
                  readOnly
                  value={member.member_introduce}
                />
              ) : (
                <textarea
                  style={{
                    boxShadow: "1px 1px 3px 2px #dadce0 inset",
                    width: "600px",
                    height: "150px",
                    borderRadius: "6px",
                    textIndent: "15px",
                    fontSize: "16px",
                    paddingTop: "15px",
                    color: "gray",
                  }}
                  readOnly
                  value={"자기 소개를 작성해 주세요."}
                />
              )}
            </Flex>
          </FormControl>
        </CardBody>

        <CardFooter>
          <Flex gap={60}>
            {/* 내 주소록 조회 버튼 */}
            <Button
              bg={"none"}
              shadow={"3px 3px 3px 3px #f5f6f6"}
              w={"180px"}
              {...buttonStyle}
              onClick={() => navigate("/memberPage/addressInfo")}
            >
              내 주소록 조회 하기
            </Button>
            <Flex gap={2}>
              <Button
                bg={"none"}
                w={"100px"}
                {...buttonStyle}
                onClick={() => navigate("/memberPage/memberEdit")}
              >
                수정하기
              </Button>
              <Button {...buttonStyle} w={"100px"} bg={"red"} onClick={onOpen}>
                회원 탈퇴
              </Button>
            </Flex>
          </Flex>
        </CardFooter>
      </Card>

      {/* 삭제 모달창 */}
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>회원 탈퇴 😭</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>정말 탈퇴 하시겠습니까?</Box>
              <Box color={"red"}>탈퇴 버튼 클릭시 즉시 탈퇴 처리 됩니다.</Box>
            </ModalBody>

            <ModalFooter>
              <Button mr={3} onClick={onClose}>
                취소
              </Button>
              <Button colorScheme={"red"} onClick={handleMemberDeleteClick}>
                탈퇴
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </Center>
  );
}
