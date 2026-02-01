import User from "../models/User.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password -__v"); 

    return res.status(200).json({
      message: "Users fetched successfully",
      count: users.length,
      users,
    });

  } catch (error) {
    console.error("Error fetching users", error);
    return res.status(500).json({
      message: "Server error",
      users: null,
    });
  }
};

export default getAllUsers;
