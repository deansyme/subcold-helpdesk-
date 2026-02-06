import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { UserForm } from '../UserForm'

interface EditUserPageProps {
  params: { id: string }
}

async function getUser(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
    }
  })
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const user = await getUser(params.id)

  if (!user) {
    notFound()
  }

  return <UserForm user={user} />
}
