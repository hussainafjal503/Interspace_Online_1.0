import Conversation from "../models/conversation.models.js";
import Message from "../models/message.models.js";
import { getReceiverSockedId, io } from "../socket/socket.js";

/**********************************
 *        For Communication       *
 **********************************/

/**************** Send Message Function ***********/
export const sendMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;
    const { textMessage:message } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate('messages')

    //establish the conversation if not started yet
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await Promise.all([conversation.save(), newMessage.save()]);
    }

    //implementing socket io for real time data transfer.
    const receiverSocketId = getReceiverSockedId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (err) {
    console.log(`sendMessage Error: ${err}`);
  }
};

/***************  get message function ******************/

export const getMessage = async (req, res) => {
  try {
    const senderId = req.id;
    const receiverId = req.params.id;

    const conversation = await Conversation.find({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(200).json({
        success: true,
        messages: [],
      });
    }
// console.log(`conversasation `,conversation);
    return res.status(200).json({
      success: true,
      messages: conversation.messages,
    });
  } catch (err) {
    console.log(`getMessage Error :${err}`);
  }
};
