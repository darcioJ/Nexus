import { Router } from 'express';
import * as archiveController from '../controllers/archive.controller';
import { extractUser, protectUser, authorizeMaster } from '../middleware/auth';

const router = Router();

/**
 * ACESSO DE LEITURA (Sincronia Aberta)
 * Usamos extractUser para que o controller saiba se o usuário é mestre 
 * e decida se mostra logs não publicados (drafts).
 */
router.get('/', extractUser, archiveController.getAllArchives);
router.get('/:id', extractUser, archiveController.getArchiveById);

/**
 * PROTOCOLOS DE ESCRITA (Exclusivo Mestre_Nexus)
 * protectUser: Garante que há um sinal (token) válido.
 * authorizeMaster: Valida se o sinal pertence a um Mestre.
 */
router.post(
  '/', 
  [protectUser, authorizeMaster], 
  archiveController.createArchive
);

router.put(
  '/:id', 
  [protectUser, authorizeMaster], 
  archiveController.updateArchive
);

router.delete(
  '/:id', 
  [protectUser, authorizeMaster], 
  archiveController.deleteArchive
);

export default router;