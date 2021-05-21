import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input
} from "@chakra-ui/react";
import React from "react";
import { User } from "../../../models";
import { Formik, Form, Field } from "formik";
import { client } from "../../../api-client";

interface Props {
  user?: User;
  onClose: () => void;
}

export const UserInfoForm = ({ user, onClose }: Props) => {
  return (
    <Formik
      initialValues={{
        name: user.name
      }}
      onSubmit={values => {
        client().editUser(values.name);
      }}
    >
      {props => (
        <Box>
          {/* <Field>
          <FormControl>
            <FormLabel>Avatar URL</FormLabel>
            <Input defaultValue={user.avatarUrl} />
          </FormControl>
        </Field> */}
          <Form>
            <Field name="name">
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.name && form.touched.name}>
                  <FormLabel htmlFor="name">Username</FormLabel>
                  <Input {...field} id="name" placeholder="Username" />
                  <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <ButtonGroup mt="8">
              <Button bg="red.500" isLoading={props.isSubmitting} type="submit">
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ButtonGroup>
          </Form>
        </Box>
      )}
    </Formik>
  );
};
