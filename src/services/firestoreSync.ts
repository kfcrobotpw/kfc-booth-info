import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Festival, Member, Robot, WebAppIdea, RobotDeploymentRequest, WebAppIdeaRequest } from '../types';

export interface SyncListeners {
  onFestivals?: (festivals: Festival[]) => void;
  onMembers?: (members: Member[]) => void;
  onRobots?: (robots: Robot[]) => void;
  onWebApps?: (webApps: WebAppIdea[]) => void;
  onRobotRequests?: (requests: RobotDeploymentRequest[]) => void;
  onWebAppRequests?: (requests: WebAppIdeaRequest[]) => void;
  onActiveFestivalId?: (id: string) => void;
  onStatusChange?: (status: 'connected' | 'syncing' | 'error' | 'offline') => void;
}

export function subscribeToFirestoreSync(listeners: SyncListeners): () => void {
  const unsubs: Array<() => void> = [];

  listeners.onStatusChange?.('syncing');

  // 1. Festivals collection
  try {
    const unsubFestivals = onSnapshot(
      collection(db, 'festivals'),
      snapshot => {
        const items = snapshot.docs.map(docSnap => docSnap.data() as Festival);
        if (items.length > 0 && listeners.onFestivals) {
          listeners.onFestivals(items);
        }
        listeners.onStatusChange?.('connected');
      },
      error => {
        listeners.onStatusChange?.('error');
        handleFirestoreError(error, OperationType.LIST, 'festivals');
      }
    );
    unsubs.push(unsubFestivals);
  } catch (e) {
    listeners.onStatusChange?.('error');
    console.error('Festivals subscription failed', e);
  }

  // 2. Members collection
  try {
    const unsubMembers = onSnapshot(
      collection(db, 'members'),
      snapshot => {
        const items = snapshot.docs.map(docSnap => docSnap.data() as Member);
        if (listeners.onMembers) {
          listeners.onMembers(items);
        }
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, 'members');
      }
    );
    unsubs.push(unsubMembers);
  } catch (e) {
    console.error('Members subscription failed', e);
  }

  // 3. Robots collection
  try {
    const unsubRobots = onSnapshot(
      collection(db, 'robots'),
      snapshot => {
        const items = snapshot.docs.map(docSnap => docSnap.data() as Robot);
        if (listeners.onRobots) {
          listeners.onRobots(items);
        }
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, 'robots');
      }
    );
    unsubs.push(unsubRobots);
  } catch (e) {
    console.error('Robots subscription failed', e);
  }

  // 4. WebApps collection
  try {
    const unsubWebApps = onSnapshot(
      collection(db, 'webApps'),
      snapshot => {
        const items = snapshot.docs.map(docSnap => docSnap.data() as WebAppIdea);
        if (listeners.onWebApps) {
          listeners.onWebApps(items);
        }
      },
      error => {
        handleFirestoreError(error, OperationType.LIST, 'webApps');
      }
    );
    unsubs.push(unsubWebApps);
  } catch (e) {
    console.error('WebApps subscription failed', e);
  }

    // 5. Robot Deployment Requests
    try {
      const unsubRequests = onSnapshot(
        collection(db, 'robot_requests'),
        snapshot => {
          const items = snapshot.docs.map(docSnap => docSnap.data() as RobotDeploymentRequest);
          if (listeners.onRobotRequests) {
            listeners.onRobotRequests(items);
          }
        },
        error => {
          handleFirestoreError(error, OperationType.LIST, 'robot_requests');
        }
      );
      unsubs.push(unsubRequests);
    } catch (e) {
      console.error('Robot requests subscription failed', e);
    }

    // 6. WebApp Idea Requests
    try {
      const unsubWebAppRequests = onSnapshot(
        collection(db, 'webapp_requests'),
        snapshot => {
          const items = snapshot.docs.map(docSnap => docSnap.data() as WebAppIdeaRequest);
          if (listeners.onWebAppRequests) {
            listeners.onWebAppRequests(items);
          }
        },
        error => {
          handleFirestoreError(error, OperationType.LIST, 'webapp_requests');
        }
      );
      unsubs.push(unsubWebAppRequests);
    } catch (e) {
      console.error('WebApp requests subscription failed', e);
    }

    // 7. Active Festival Global State
    try {
      const unsubState = onSnapshot(
        doc(db, 'app_state', 'global'),
        docSnap => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data?.activeFestivalId && listeners.onActiveFestivalId) {
              listeners.onActiveFestivalId(data.activeFestivalId);
            }
          }
        },
        error => {
          handleFirestoreError(error, OperationType.GET, 'app_state/global');
        }
      );
      unsubs.push(unsubState);
    } catch (e) {
      console.error('App state subscription failed', e);
    }

  return () => {
    unsubs.forEach(u => u());
  };
}

export async function syncFestivalToFirestore(festival: Festival): Promise<void> {
  const path = `festivals/${festival.id}`;
  try {
    await setDoc(doc(db, 'festivals', festival.id), festival);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteFestivalFromFirestore(id: string): Promise<void> {
  const path = `festivals/${id}`;
  try {
    await deleteDoc(doc(db, 'festivals', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncMemberToFirestore(member: Member): Promise<void> {
  const path = `members/${member.id}`;
  try {
    await setDoc(doc(db, 'members', member.id), member);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteMemberFromFirestore(id: string): Promise<void> {
  const path = `members/${id}`;
  try {
    await deleteDoc(doc(db, 'members', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncRobotToFirestore(robot: Robot): Promise<void> {
  const path = `robots/${robot.id}`;
  try {
    await setDoc(doc(db, 'robots', robot.id), robot);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteRobotFromFirestore(id: string): Promise<void> {
  const path = `robots/${id}`;
  try {
    await deleteDoc(doc(db, 'robots', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncWebAppToFirestore(app: WebAppIdea): Promise<void> {
  const path = `webApps/${app.id}`;
  try {
    await setDoc(doc(db, 'webApps', app.id), app);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteWebAppFromFirestore(id: string): Promise<void> {
  const path = `webApps/${id}`;
  try {
    await deleteDoc(doc(db, 'webApps', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncActiveFestivalIdToFirestore(id: string): Promise<void> {
  const path = 'app_state/global';
  try {
    await setDoc(doc(db, 'app_state', 'global'), { activeFestivalId: id }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncRobotRequestToFirestore(request: RobotDeploymentRequest): Promise<void> {
  const path = `robot_requests/${request.id}`;
  try {
    await setDoc(doc(db, 'robot_requests', request.id), request);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteRobotRequestFromFirestore(id: string): Promise<void> {
  const path = `robot_requests/${id}`;
  try {
    await deleteDoc(doc(db, 'robot_requests', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncWebAppRequestToFirestore(request: WebAppIdeaRequest): Promise<void> {
  const path = `webapp_requests/${request.id}`;
  try {
    await setDoc(doc(db, 'webapp_requests', request.id), request);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteWebAppRequestFromFirestore(id: string): Promise<void> {
  const path = `webapp_requests/${id}`;
  try {
    await deleteDoc(doc(db, 'webapp_requests', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function purgeFirestoreDummyTestData(): Promise<void> {
  const dummyMemberIds = ['m-1', 'm-2', 'm-3', 'm-4', 'm-5'];
  const dummyRobotIds = ['r-1', 'r-2', 'r-3'];
  const dummyAppIds = ['app-1', 'app-2'];

  for (const id of dummyMemberIds) {
    try {
      await deleteDoc(doc(db, 'members', id));
    } catch {
      // Ignore
    }
  }
  for (const id of dummyRobotIds) {
    try {
      await deleteDoc(doc(db, 'robots', id));
    } catch {
      // Ignore
    }
  }
  for (const id of dummyAppIds) {
    try {
      await deleteDoc(doc(db, 'webApps', id));
    } catch {
      // Ignore
    }
  }
}
