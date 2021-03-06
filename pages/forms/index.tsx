import Link from 'next/link'
import { Heading, Box, PseudoBox, Button } from '@chakra-ui/core'
import { Form } from '@prisma/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ssrFetch, redirectUser } from '../../src/lib/helpers'
import { useForms } from '../../src/hooks'
import { createForm, getFormUrl } from '../../src/lib/form'
import ErrorComponent from '../../src/components/Error'
import Loading from '../../src/components/Loading'
import { useFormzyToast } from '../../src/hooks/toast'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const data = await ssrFetch<Form[]>(`/forms`, req)
    return { props: { data } }
  } catch (e) {
    redirectUser(res)
    return { props: {} }
  }
}

const IndexPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data, error, mutate } = useForms(props.data)
  const { errorToast, successToast } = useFormzyToast()

  const handleCreate = async () => {
    try {
      await createForm()
      mutate()
      successToast('Your Form has been created successfully')
    } catch (e) {
      errorToast()
    }
  }

  if (error) return <ErrorComponent />
  if (!data) return <Loading />

  return (
    <Box w="full">
      <Heading fontWeight="bold" size="2xl">
        Your Forms:
      </Heading>
      {data.map((form) => (
        <Link key={form.id} href={getFormUrl(form.id)}>
          <PseudoBox
            py={2}
            px={4}
            rounded="md"
            display="flex"
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
            my={4}
            fontSize={18}
            justifyContent="space-between"
            maxW="600px"
          >
            <Heading cursor="pointer">{form.name}</Heading>
          </PseudoBox>
        </Link>
      ))}
      <Button leftIcon="add" variantColor="blue" onClick={handleCreate}>
        New Form
      </Button>
    </Box>
  )
}

export default IndexPage
