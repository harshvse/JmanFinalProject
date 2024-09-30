const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function fetchOrderData(userId) {
  const orders = await prisma.order.findMany({
    where: {
      buyerId: userId,
    },
    include: {
      event: true, // Include event details in the order
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
  // return orders.map((order) => ({
  //   id: order.id,
  //   eventTitle: order.event.title,
  //   quantity: order.quantity,
  //   totalAmount: order.totalAmount,
  //   createdAt: order.createdAt,
  // }));
}

async function getUsersWithOrderCount(page = 1, limit = 20, search = "") {
  const skip = (page - 1) * limit;

  // Modify the where clause to include search by email or name
  const where = search
    ? {
        OR: [
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            firstName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            lastName: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  // Get total count of filtered users
  const totalUsers = await prisma.user.count({ where });

  // Fetch users with pagination and search filter
  const users = await prisma.user.findMany({
    skip,
    take: limit,
    where,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { orders: true },
      },
    },
  });

  const totalPages = Math.ceil(totalUsers / limit);

  return {
    users: users.map((user) => ({
      ...user,
      orderCount: user._count.orders,
    })),
    totalUsers,
    totalPages,
    currentPage: page,
  };
}

module.exports = {
  fetchOrderData,
  getUsersWithOrderCount,
};
