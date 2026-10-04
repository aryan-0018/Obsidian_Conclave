import Session from "../model/Session.js";
import User from "../model/User.js";
import { RoomServiceClient } from "livekit-server-sdk";

// Initialize RoomServiceClient for host controls
const getLivekitRoomService = () => {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.LIVEKIT_URL;

  if (!apiKey || !apiSecret || !livekitUrl) {
    throw new Error("LiveKit credentials are not configured");
  }

  // Convert wss:// to https:// for the REST API
  const httpUrl = livekitUrl.replace("wss://", "https://");
  return new RoomServiceClient(httpUrl, apiKey, apiSecret);
};

export const listSession = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { status } = req.query;

    const statusFilter = status && status !== "all" ? { status } : {};

    const session = await Session.find({
      $and: [
        statusFilter,
        {
          $or: [{ host: userId }, { "participants.userId": userId }],
        },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const result = session.map((s) => ({
      id: s._id,
      roomId: s.roomId,
      hostName: s.hostName,
      meetingType: s.meetingType || 'public',
      status: s.status,
      participantCount: s.participants?.length || 0,
      startedAt: s.startedAt,
      endedAt: s.endedAt,
      isHost: s.host?.toString() === userId.toString(),
    }));

    res.json({
      success: true,
      data: {
        session: result,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createSession = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { meetingType } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    //genereate unique room Id
    let roomId;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      roomId = Session.generateRoomId();
      const exits = await Session.roomIdExists(roomId);
      if (!exits) break;
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate unique room ID. Please try again",
      });
    }

    const session = await Session.create({
      roomId,
      host: userId,
      hostName: user.name,
      meetingType: meetingType === 'private' ? 'private' : 'public',
      participants: [
        {
          userId: userId,
          userName: user.name,
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: {
        session: {
          id: session._id,
          roomId: session.roomId,
          hostName: session.hostName,
          meetingType: session.meetingType,
          status: session.status,
          participantCount: session.participants.length,
          startedAt: session.startedAt,
          participants: session.participants,
          pendingParticipants: session.pendingParticipants || [],
          isHost: true,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const JoinSession = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.userId;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        error: "Room Id is required",
      });
    }

    const session = await Session.findOne({ roomId });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found. Please check the roomId",
      });
    }

    if (session.status !== "active") {
      return res.status(400).json({
        success: false,
        error: "This session has ended",
      });
    }

    // Check if user is already a participant
    const alreadyJoined = session.participants.some(
      (p) => p.userId.toString() === userId.toString(),
    );

    if (alreadyJoined) {
      return res.json({
        success: true,
        data: {
          session: {
            id: session._id,
            roomId: session.roomId,
            hostName: session.hostName,
            meetingType: session.meetingType,
            status: session.status,
            participantCount: session.participants.length,
            isHost: session.host.toString() === userId.toString(),
            participants: session.participants,
            pendingParticipants: session.host.toString() === userId.toString() ? (session.pendingParticipants || []) : [],
            joinStatus: 'joined',
          },
        },
      });
    }

    // Check if user is already pending
    const alreadyPending = session.pendingParticipants?.some(
      (p) => p.userId.toString() === userId.toString(),
    );

    if (alreadyPending) {
      return res.json({
        success: true,
        data: {
          session: {
            id: session._id,
            roomId: session.roomId,
            hostName: session.hostName,
            meetingType: session.meetingType,
            status: session.status,
            participantCount: session.participants.length,
            isHost: false,
            participants: session.participants,
            pendingParticipants: [],
            joinStatus: 'pending',
          },
        },
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // For PRIVATE meetings: add to pending, not participants
    if (session.meetingType === 'private') {
      session.pendingParticipants.push({
        userId: userId,
        userName: user.name,
      });

      await session.save();

      return res.json({
        success: true,
        data: {
          session: {
            id: session._id,
            roomId: session.roomId,
            hostName: session.hostName,
            meetingType: session.meetingType,
            status: session.status,
            participantCount: session.participants.length,
            isHost: false,
            participants: session.participants,
            pendingParticipants: [],
            joinStatus: 'pending',
          },
        },
      });
    }

    // For PUBLIC meetings: add directly to participants
    session.participants.push({
      userId: userId,
      userName: user.name,
    });

    await session.save();

    res.json({
      success: true,
      data: {
        session: {
          id: session._id,
          roomId: session.roomId,
          hostName: session.hostName,
          meetingType: session.meetingType,
          status: session.status,
          participantCount: session.participants.length,
          isHost: session.host.toString() === userId.toString(),
          participants: session.participants,
          pendingParticipants: [],
          joinStatus: 'joined',
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.userId;

    const session = await Session.findOne({ roomId }).lean();
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found. Please check the roomId",
      });
    }

    const isHost = session.host?.toString() === userId.toString();
    const isParticipant = (session.participants || []).some(
      (p) => p.userId?.toString() === userId.toString(),
    );
    const isPending = (session.pendingParticipants || []).some(
      (p) => p.userId?.toString() === userId.toString(),
    );

    let joinStatus = 'none';
    if (isParticipant) joinStatus = 'joined';
    else if (isPending) joinStatus = 'pending';

    res.json({
      success: true,
      data: {
        session: {
          id: session._id,
          roomId: session.roomId,
          hostName: session.hostName,
          meetingType: session.meetingType,
          status: session.status,
          participantCount: session.participants.length,
          isHost,
          isParticipant,
          participants: session.participants,
          pendingParticipants: isHost ? (session.pendingParticipants || []) : [],
          joinStatus,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const endSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.userId;

    const session = await Session.findById(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found.",
      });
    }

    //verify user is the host
    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the host can end the session",
      });
    }

    //check if already ended
    if (session.status === "ended") {
      return res.status(400).json({
        success: false,
        error: "Session has already ended",
      });
    }

    session.status = "ended";
    session.endedAt = new Date();
    session.pendingParticipants = [];
    await session.save();

    // Immediately terminate the LiveKit room so all participants are disconnected globally
    try {
      const roomService = getLivekitRoomService();
      await roomService.deleteRoom(session.roomId);
    } catch (lkErr) {
      console.error("LiveKit deleteRoom error (non-fatal):", lkErr.message);
    }

    res.json({
      success: true,
      data: {
        session: {
          id: session._id,
          roomId: session.roomId,
          status: session.status,
          endedAt: session.endedAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const leaveSession = async (req, res, next) => {
  try {
    const { roomId } = req.body;
    const userId = req.user.userId;

    if (!roomId) {
      return res.status(400).json({
        success: false,
        error: "Room Id is required",
      });
    }

    const session = await Session.findOne({ roomId });
    if (!session) {
      return res.status(404).json({
        success: false,
        error: "Session not found.",
      });
    }

    // Remove from participants
    session.participants = session.participants.filter(
      (p) => p.userId.toString() !== userId.toString(),
    );

    // Also remove from pending if present
    session.pendingParticipants = (session.pendingParticipants || []).filter(
      (p) => p.userId.toString() !== userId.toString(),
    );

    await session.save();

    res.json({
      success: true,
      data: {
        message: "Left session successfully",
      },
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// Waiting Room: Admit / Deny
// ========================================

export const admitParticipant = async (req, res, next) => {
  try {
    const { roomId, pendingUserId } = req.body;
    const userId = req.user.userId;

    const session = await Session.findOne({ roomId });
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }

    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: "Only the host can admit participants" });
    }

    if (session.status !== 'active') {
      return res.status(400).json({ success: false, error: "Session is not active" });
    }

    // Find the pending participant
    const pendingIndex = session.pendingParticipants.findIndex(
      (p) => p.userId?.toString() === pendingUserId?.toString()
    );

    if (pendingIndex === -1) {
      return res.status(404).json({ success: false, error: "Participant not found in waiting room" });
    }

    const pending = session.pendingParticipants[pendingIndex];

    // Move from pending → participants
    session.participants.push({
      userId: pending.userId,
      userName: pending.userName,
    });
    session.pendingParticipants.splice(pendingIndex, 1);

    await session.save();

    res.json({
      success: true,
      data: {
        message: `${pending.userName} admitted to session`,
        participants: session.participants,
        pendingParticipants: session.pendingParticipants,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const denyParticipant = async (req, res, next) => {
  try {
    const { roomId, pendingUserId } = req.body;
    const userId = req.user.userId;

    const session = await Session.findOne({ roomId });
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }

    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: "Only the host can deny participants" });
    }

    const pendingIndex = session.pendingParticipants.findIndex(
      (p) => p.userId?.toString() === pendingUserId?.toString()
    );

    if (pendingIndex === -1) {
      return res.status(404).json({ success: false, error: "Participant not found in waiting room" });
    }

    const denied = session.pendingParticipants[pendingIndex];
    session.pendingParticipants.splice(pendingIndex, 1);

    await session.save();

    res.json({
      success: true,
      data: {
        message: `${denied.userName} denied entry`,
        pendingParticipants: session.pendingParticipants,
      },
    });
  } catch (error) {
    next(error);
  }
};


// ========================================
// Host Controls: Remove Participant
// ========================================

export const removeParticipant = async (req, res, next) => {
  try {
    const { roomId, targetUserId } = req.body;
    const userId = req.user.userId;

    const session = await Session.findOne({ roomId });
    if (!session) {
      return res.status(404).json({ success: false, error: "Session not found" });
    }

    if (session.host.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: "Only the host can remove participants" });
    }

    // Can't remove self (host)
    if (targetUserId === userId.toString()) {
      return res.status(400).json({ success: false, error: "Cannot remove yourself" });
    }

    const participantIndex = session.participants.findIndex(
      (p) => p.userId?.toString() === targetUserId?.toString()
    );

    if (participantIndex === -1) {
      return res.status(404).json({ success: false, error: "Participant not found" });
    }

    const removed = session.participants[participantIndex];
    session.participants.splice(participantIndex, 1);
    await session.save();

    // Also remove from LiveKit room
    try {
      const roomService = getLivekitRoomService();
      await roomService.removeParticipant(roomId, targetUserId);
    } catch (lkError) {
      console.error("LiveKit removeParticipant error (non-fatal):", lkError.message);
    }

    res.json({
      success: true,
      data: {
        message: `${removed.userName} removed from session`,
        participants: session.participants,
      },
    });
  } catch (error) {
    next(error);
  }
};
