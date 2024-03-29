import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Form, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export function QnaWriteAnswer() {
  const { question_id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const [questionInfo, setQuestionInfo] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [answerCopy, setAnswerCopy] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/qna/admin/${question_id}`)
      .then((response) => {
        const {
          question_id,
          product_id,
          product_name,
          question_title,
          question_content,
          answer_content,
          answer_id,
        } = response.data;

        const questionInfoData = {
          question_id,
          product_name,
          question_title,
          question_content,
        };

        const answerData = {
          product_id,
          question_id,
          answer_id,
          answer_content,
        };

        setQuestionInfo(questionInfoData);
        setAnswer(answerData);
        setAnswerCopy(answerData);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 확인해보세요",
            status: "error",
          });
        } else if (error.response.status === 403) {
          toast({
            title: "접근 권한이 없습니다",
            description: "관리자 외에 문의 답변 등록이 불가능합니다",
            status: "error",
          });
          navigate("/");
        } else {
          toast({
            title: "문의 정보를 가져오는 도중 에러가 발생했습니다",
            description: "현상이 계속되면 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }, [question_id]);

  const formattedDate = (question_reg_time) => {
    const date = new Date(question_reg_time);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
  };

  function handleSubmit() {
    axios
      .put("/api/qna/answer/write", {
        question_id: answerCopy.question_id,
        product_id: answerCopy.product_id,
        answer_content: answerCopy.answer_content,
      })
      .then(() => {
        toast({
          title: "성공적으로 문의 답변을 등록하였습니다",
          description: "리스트로 돌아갑니다",
          status: "success",
        });
        navigate(-1);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description: "백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else if (error.response.status === 403) {
          toast({
            title: "접근 권한이 없습니다",
            description: "관리자만 접속 가능합니다",
            status: "error",
          });
        } else if (error.response.status === 400) {
          toast({
            title: "Bad Request",
            description: "요청 코드를 점검해주세요",
            status: "warning",
          });
        } else {
          toast({
            title: "문의 답변을 등록하는 도중 오류 발생",
            description: "현상이 계속될 경우 관리자에게 문의해주세요",
            status: "error",
          });
        }
      });
  }

  function handleUpdate() {
    axios
      .put("/api/qna/answer/update", {
        answer_id: answerCopy.answer_id,
        answer_content: answerCopy.answer_content,
      })
      .then(() => {
        toast({
          title: "성공적으로 답변을 수정하였습니다",
          description: "다시 리스트로 되돌아갑니다",
          status: "success",
        });
        navigate(-1);
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description:
              "답변을 수정하던 도중 에러가 발생했습니다. 백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else if (error.response.status === 400) {
          toast({
            title: "Bad Request Error",
            description: "백엔드와 프론트 코드의 파라미터를 다시 확인해주세요",
            status: "error",
          });
        } else if (error.response.status === 403) {
          toast({
            title: "권한이 없습니다",
            description: "문의 수정은 관리자만 가능합니다",
            status: "error",
          });
        } else {
          toast({
            title: "답변 수정 중 에러 발생",
            description: "현상이 지속되면 관리자에게 문의 바랍니다",
            status: "error",
          });
        }
      });
  }

  function handleDelete() {
    axios
      .delete("/api/qna/answer/delete", {
        params: {
          answer_id: answerCopy.answer_id,
        },
      })
      .then(() => {
        toast({
          title: "문의 답변을 성공적으로 삭제하였습니다",
          description: "삭제된 답변은 다시 복구되지 않습니다",
          status: "success",
        });
        navigate("/adminPage/qna");
      })
      .catch((error) => {
        if (error.response.status === 500) {
          toast({
            title: "Internal Server Error",
            description:
              "답변을 삭제하던 도중 에러가 발생했습니다. 백엔드 코드를 점검해주세요",
            status: "error",
          });
        } else if (error.response.status === 400) {
          toast({
            title: "Bad Request Error",
            description: "백엔드와 프론트 코드의 파라미터를 다시 확인해주세요",
            status: "error",
          });
        } else if (error.response.status === 403) {
          toast({
            title: "권한이 없습니다",
            description: "문의 삭제는 관리자만 가능합니다",
            status: "error",
          });
        } else {
          toast({
            title: "문의 삭제 중 에러 발생",
            description: "현상이 지속되면 관리자에게 문의 바랍니다",
            status: "error",
          });
        }
      });
  }

  return (
    <Card w="full" px="3%" id="answerSection">
      <CardHeader>
        <Heading size="lg">
          답변 {answer?.answer_id !== null ? "수정" : "등록"}
        </Heading>
      </CardHeader>
      <CardBody>
        {questionInfo !== null && (
          <>
            <Form>
              <FormControl mb={5}>
                <FormLabel fontWeight="bold" mb={5}>
                  <Text
                    py={2}
                    px={5}
                    as="span"
                    border="1px solid black"
                    borderRadius={0}
                  >
                    상품명
                  </Text>
                </FormLabel>
                <Input
                  p={0}
                  border="none"
                  readOnly
                  value={questionInfo.product_name}
                />
              </FormControl>
              <FormControl mb={5}>
                <FormLabel fontWeight="bold" mb={5}>
                  <Text
                    py={2}
                    px={5}
                    as="span"
                    border="1px solid black"
                    borderRadius={0}
                  >
                    문의 제목
                  </Text>
                </FormLabel>
                <Input
                  p={0}
                  border="none"
                  readOnly
                  value={questionInfo.question_title}
                />
              </FormControl>
              <FormControl mb={5}>
                <FormLabel fontWeight="bold" mb={5}>
                  <Text
                    py={2}
                    px={5}
                    as="span"
                    border="1px solid black"
                    borderRadius={0}
                  >
                    문의 내용
                  </Text>
                </FormLabel>
                <Input
                  p={0}
                  border="none"
                  readOnly
                  value={questionInfo.question_content}
                />
              </FormControl>
            </Form>
          </>
        )}
        <Form>
          <FormControl>
            <FormLabel fontWeight="bold" mb={8}>
              <Text
                py={2}
                px={5}
                as="span"
                border="1px solid black"
                borderRadius={0}
              >
                답변 작성
              </Text>
            </FormLabel>
            <Textarea
              h="xs"
              p={5}
              _hover={{ border: "1px solid black" }}
              _focus={{ border: "1px solid black", shadow: "none" }}
              borderRadius={0}
              border="1px solid black"
              placeholder="답변을 작성하세요: 예) 안녕하세요 고객님, 000 입니다."
              value={answerCopy?.answer_content || ""}
              onChange={(e) =>
                setAnswerCopy((prevAnswerCopy) => ({
                  ...prevAnswerCopy,
                  answer_content: e.target.value,
                }))
              }
            />
          </FormControl>
        </Form>
      </CardBody>
      <CardFooter display="flex" justifyContent="center">
        <ButtonGroup w="full" justifyContent="center" pb="2%">
          <Button
            w="30%"
            bgColor="white"
            border="1px solid black"
            borderRadius={0}
            _hover={{ color: "white", bgColor: "black" }}
            onClick={() => {
              if (answer?.answer_id) {
                handleUpdate();
              } else {
                handleSubmit();
              }
            }}
          >
            {answer?.answer_id ? "수정" : "등록"}
          </Button>
          <Button
            w="30%"
            color="white"
            bgColor={answer?.answer_id ? "red" : "black"}
            variant="undefined"
            borderRadius={0}
            onClick={() => {
              if (answer?.answer_id) {
                handleDelete();
              } else {
                setAnswerCopy(answer);
                navigate("/adminPage/qna");
              }
            }}
          >
            {answer?.answer_id ? "삭제" : "취소"}
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
}
