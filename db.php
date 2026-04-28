<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

class ApiWebServiceController extends Controller {
    public $enableCsrf = false;
    
    // public function filters() {
    //     // Use access control filter
    //     return ['accessControl'];
    // }
    
    // public function accessRules() {
    //     // Only allow authenticated users
    //     return [['allow', 'users' => ['@']], ['deny']];
    // }
    
    public function actiongetHaped() {
        echo("HALO MAS HAPED");die;
    }
    
    public function actionLogin() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (!isset($post['username']) || !isset($post['password'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Username dan password wajib diisi!'
            ]);
            Yii::app()->end();
        }
        
        $username = $post['username'];
        $password = $post['password'];
        
        $user = MUser::model()->findByAttributes(
                    ['username' => $username],
                    ['select' => 'id, username, password']
            );
        
        if (!$user) {
            echo json_encode([
                'status' => false,
                'message' => 'Username tidak ditemukan!'
            ]);
            Yii::app()->end();
        }
        
        if (!password_verify($password, $user->password)) {
            echo json_encode([
                'status' => false,
                'message' => 'Password salah!'
            ]);   
            Yii::app()->end();
        }
        
        $sql = 'SELECT
                    mu.*,
                    mr.name AS "role_name",
                    mc.name AS "client_name"
                FROM m_user mu
                LEFT JOIN m_role mr ON mr.id = mu.id_role
                LEFT JOIN m_client mc ON mc.id = mu.id_client
                WHERE
                    mu.id = :id_user';
        
        $res = Yii::app()->db->createCommand($sql)
            ->bindValue(':id_user', $user->id)
            ->queryRow();

        unset($res['password']);

        echo json_encode([
            'status'  => true,
            'message' => "Login berhasil!",
            'data'    => $res
        ]);
    }
    
    public function actionUpdateProfile() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (
            !isset($post['id_user']) ||
            !isset($post['display_name'])
        ) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }
        
        $user = MUser::model()->findByPk($post["id_user"]);
        
        if (!$user) {
            echo json_encode([
                'status'  => false,
                'message' => 'User tidak ditemukan!'
            ]);
            Yii::app()->end();
        }
        
        $user->display_name  = $post['display_name'];
        $user->email         = $post['email'] ?? null;
        $user->phone         = $post['phone'] ?? null;
        $user->address       = $post['address'] ?? null;
        $user->date_of_birth = $post['date_of_birth'] ?? null;
        $user->code          = $post['code'] ?? null;
        
        if (!$user->save()) {
            echo json_encode([
                'status'  => false,
                'message' => 'Data gagal diupdate!'
            ]);
            Yii::app()->end();
        }
    
        echo json_encode([
            'status'  => true,
            'message' => 'Data berhasil diupdate!',
            'data'    => [
                'id_user' => $user->id,
            ]
        ]);
    }
    
    public function actionChangePassword() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (
            !isset($post['updated_by']) ||
            !isset($post['id_user']) ||
            !isset($post['password']) ||
            !isset($post['confirm_password'])
        ) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }
        
        $password         = $post['password'];
        $confirm_password = $post['confirm_password'];

        if ($password !== $confirm_password) {
            echo json_encode([
                'status' => false,
                'message' => 'Password not match!'
            ]);
            Yii::app()->end();
        }
        
        $user = MUser::model()->findByPk($post["id_user"]);
        
        if (!$user) {
            echo json_encode([
                'status'  => false,
                'message' => 'User tidak ditemukan!'
            ]);
            Yii::app()->end();
        }
        
        try {
            $user->password       = password_hash($post['password'], PASSWORD_BCRYPT);
            $user->updated_date   = date('Y-m-d H:i:s');
            $user->updated_by     = $post['updated_by'];
            $user->save(false);
        
            echo json_encode([
                'status'  => true,
                'message' => 'Data berhasil diupdate!',
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'status'  => false,
                'message' => $e->getMessage()
            ]);
        }
        Yii::app()->end();
    }
    
    
    
    // === MASTER STAGE ===
    // option : ppds (Active) | staff (?)
    public function actionGetMasterUser() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (
            !isset($post['id_client']) ||
            !isset($post['role_name'])
            ) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }
        
        $sql = 'SELECT
                    mu.id,
                    mu.display_name AS "name"
                FROM m_user mu
                LEFT JOIN m_role mr ON mr.id = mu.id_role
                WHERE
                    mu.status     = :status 
                AND mu.is_show    = :is_show
                AND mu.deleted_at IS NULL 
                AND mu.id_client  = :id_client
                AND mr.name       = :role_name
                ORDER BY 
                    mu.display_name ASC';
        
        $res = Yii::app()->db->createCommand($sql)
            ->bindValue(':status', 'Active')
            ->bindValue(':is_show', true)
            ->bindValue(':id_client', $post['id_client'])
            ->bindValue(':role_name', $post['role_name'])
            ->queryAll();
        
        echo json_encode([
            'status'  => true,
            'total'   => count($res),
            'data'    => $res
        ]);
    }

    public function actionGetMasterPPDSInactive() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (
            !isset($post['id_client']) ||
            !isset($post['role_name'])
            ) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }
        
        $sql = 'SELECT
                    mu.id,
                    mu.display_name AS "name"
                FROM m_user mu
                LEFT JOIN m_role mr ON mr.id = mu.id_role
                WHERE
                    mu.status     = :status 
                -- AND mu.is_show    = :is_show
                AND mu.deleted_at IS NULL 
                AND mu.id_client  = :id_client
                AND mr.name       = :role_name
                ORDER BY 
                    mu.display_name ASC';
        
        $res = Yii::app()->db->createCommand($sql)
            ->bindValue(':status', 'Inactive')
            // ->bindValue(':is_show', true)
            ->bindValue(':id_client', $post['id_client'])
            ->bindValue(':role_name', $post['role_name'])
            ->queryAll();
        
        echo json_encode([
            'status'  => true,
            'total'   => count($res),
            'data'    => $res
        ]);
    }
    
    // option : stase
    public function actionGetMasterStase() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (!isset($post['id_client'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }
        
        $sql = 'SELECT
                    ms.id,
                    ms.name
                FROM m_stase ms
                WHERE
                    ms.id_client = :id_client
                ORDER BY 
                    name ASC';
        
        $res = Yii::app()->db->createCommand($sql)
            ->bindValue(':id_client', $post['id_client'])
            ->queryAll();
        
        echo json_encode([
            'status'  => true,
            'total'   => count($res),
            'data'    => $res
        ]);
    }
    
    public function actionGetMasterStaff() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (!isset($post['id_client'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }

        $sql = 'SELECT DISTINCT ON (mu.display_name)
                    mu.id,
                    mu.display_name AS "name"
                FROM t_logbook_status tls
                LEFT JOIN m_user mu ON mu.id = tls.id_user
                LEFT JOIN m_action_role mar ON mar.id = tls.id_action_role
                WHERE
                    mu.deleted_at IS NULL
                AND mar.id_client = :id_client
                AND mar.role      != :role_name 
                ORDER BY
                    mu.display_name ASC';
        
        $res = Yii::app()->db->createCommand($sql)
            ->bindValue(':id_client', $post['id_client'])
            ->bindValue(':role_name', 'Peserta')
            ->queryAll();
        
        echo json_encode([
            'status'  => true,
            'total'   => count($res),
            'data'    => $res
        ]);
    }
    
    public function actionGetMasterActivity() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (!isset($post['id_client'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }
        
        $sql = 'SELECT
                    ma.id,
                    ma.name
                FROM m_action ma
                WHERE
                    ma.id_client = :id_client
                ORDER BY 
                    name ASC';
        
        $res = Yii::app()->db->createCommand($sql)
            ->bindValue(':id_client', $post['id_client'])
            ->queryAll();
        
        echo json_encode([
            'status'  => true,
            'total'   => count($res),
            'data'    => $res
        ]);
    }
    // === MASTER STAGE ===
    
    
    
    // === PPDS STAGE ===
    public function actionGetListPPDS() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (!isset($post['id_client'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }
    
        // pagination default
        $page  = isset($post['page']) ? (int)$post['page'] : 1;
        $limit = isset($post['limit']) ? (int)$post['limit'] : 10;
        $offset = ($page - 1) * $limit;
    
        // sorting (default ASC)
        $sort = (isset($post['sort']) && strtolower($post['sort']) === 'desc') ? 'DESC' : 'ASC';
    
        $sql = 'SELECT
                    mu.id,
                    mu.display_name,
                    mu.username,
                    mu.email,
                    mu.phone,
                    mu.address,
                    mu.date_of_birth,
                    mu.code AS nim,
                    mr.name AS role_name,
                    ms.name AS stase_name,
                    (
                        SELECT COUNT(*)
                        FROM t_logbook tl
                        WHERE 
                            tl.id_user = mu.id
                        AND tl.deleted_at IS NULL
                    ) AS total_logbook
                FROM m_user mu
                LEFT JOIN m_role mr ON mr.id = mu.id_role
                LEFT JOIN m_stase ms ON ms.id = mu.id_stase
                WHERE 
                    mu.id_client  = :id_client
                AND mu.status     = :status
                AND mu.is_show    = :is_show
                AND mu.deleted_at IS NULL
                AND mr.name       = :role_name';
        
        $countSql = 'SELECT COUNT(*)
                    FROM m_user mu
                    LEFT JOIN m_role mr ON mr.id = mu.id_role
                    LEFT JOIN m_stase ms ON ms.id = mu.id_stase
                    WHERE 
                        mu.id_client  = :id_client
                    AND mu.status     = :status
                    AND mu.is_show    = :is_show
                    AND mu.deleted_at IS NULL
                    AND mr.name       = :role_name';
    
        $params = [
            ':id_client' => $post['id_client'],
            ':status'    => 'Active',
            ':is_show'   => true,
            ':role_name' => 'ppds'
        ];
    
        // 🔥 optional filter
        if (!empty($post['ppds'])) {
            $sql      .= ' AND mu.id = :ppds';
            $countSql .= ' AND mu.id = :ppds';
            $params[':ppds'] = $post['ppds'];
        }
    
        if (!empty($post['stase'])) {
            $sql      .= ' AND mu.id_stase = :stase';
            $countSql .= ' AND mu.id_stase = :stase';
            $params[':stase'] = $post['stase'];
        }
    
        if (!empty($post['nim'])) {
            $sql      .= ' AND mu.code ILIKE :nim';
            $countSql .= ' AND mu.code ILIKE :nim';
            $params[':nim'] = '%' . $post['nim'] . '%';
        }
    
        // sorting + pagination
        $sql .= " ORDER BY 
                    mu.display_name 
                    $sort 
                LIMIT :limit 
                OFFSET :offset";
    
        $command      = Yii::app()->db->createCommand($sql);
        $countCommand = Yii::app()->db->createCommand($countSql);
        
        foreach ($params as $key => $val) {
            $command->bindValue($key, $val);
            $countCommand->bindValue($key, $val);
        }
    
        $command->bindValue(':limit', $limit, PDO::PARAM_INT);
        $command->bindValue(':offset', $offset, PDO::PARAM_INT);
    
        $res   = $command->queryAll();
        $total = $countCommand->queryScalar();
    
        echo json_encode([
            'status' => true,
            'total'  => (int)$total,
            'data'   => $res,
            'pagination' => [
                'page'   => $page,
                'limit'  => $limit,
            ]
        ]);
    }
    
    public function actionDeletePPDS() {
        // echo json_encode([
        //     'db' => Yii::app()->db->connectionString
        // ]);die;
        
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (!isset($post['id_user'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }
        
        try {
            $user = MUser::model()->findByPk($post["id_user"]);
            
            if (!$user) {
                echo json_encode([
                    'status'  => false,
                    'message' => 'User tidak ditemukan!'
                ]);
                Yii::app()->end();
            }
            
            $user->deleted_at = new CDbExpression('NOW()');
            $user->is_deleted = true;
            $user->save(false);

            echo json_encode([
                'status' => true,
                'message' => 'Data berhasil dihapus!'
            ]);
        
        } catch (Exception $e) {
            echo json_encode([
                'status'  => false,
                'message' => $e->getMessage()
            ]);
        }
        Yii::app()->end();
    }
    
    public function actionGetDetailPPDS() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (!isset($post['id_user'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }
    
        $sql = 'SELECT
                    mu.id,
                    mu.display_name,
                    mu.username,
                    mu.email,
                    mu.phone,
                    mu.address,
                    mu.date_of_birth,
                    mu.code AS nim,
                    mu.status,
                    mu.inactive_at,
                    mu.inactive_notes,
                    mu.reactivate_date,
                    mr.name AS role_name,
                    ms.name AS stase_name,
                    (
                        SELECT COUNT(*)
                        FROM t_logbook tl
                        WHERE 
                            tl.id_user = mu.id
                        AND tl.deleted_at IS NULL
                    ) AS total_logbook
                FROM m_user mu
                LEFT JOIN m_role mr ON mr.id = mu.id_role
                LEFT JOIN m_stase ms ON ms.id = mu.id_stase
                WHERE 
                    mu.id = :id_user';
                    
        $res = Yii::app()->db->createCommand($sql)
            ->bindValue(':id_user', $post['id_user'])
            ->queryRow();
            
        if (!$res) {
            echo json_encode([
                'status'  => false,
                'message' => 'User tidak ditemukan!'
            ]);
            Yii::app()->end();
        }
        
        echo json_encode([
            'status'  => true,
            'data'    => $res
        ]);
    }
    
    public function actionUpdatePPDS() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (
            !isset($post['id_user']) ||
            !isset($post['display_name']) ||
            !isset($post['username']) ||
            !isset($post['email']) ||
            !isset($post['phone'])
        ) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }
        
        $user = MUser::model()->findByPk($post["id_user"]);
        
        if (!$user) {
            echo json_encode([
                'status'  => false,
                'message' => 'User tidak ditemukan!'
            ]);
            Yii::app()->end();
        }
        
        $user->display_name   = $post['display_name'];
        $user->username       = $post['username'];
        $user->email          = $post['email'];
        $user->phone          = $post['phone'];
        $user->address        = $post['address'] ?? null;
        $user->date_of_birth  = $post['date_of_birth'] ?? null;
        $user->code           = $post['nim'] ?? null;
        $user->status         = $post['status'] ?? null;
        $user->inactive_at    = $post['inactive_at'] ?? null;
        $user->inactive_notes = $post['inactive_notes'] ?? null;
        
        if (!$user->save()) {
            echo json_encode([
                'status'  => false,
                'message' => 'Data gagal diupdate!'
            ]);
            Yii::app()->end();
        }
    
        echo json_encode([
            'status'  => true,
            'message' => 'Data berhasil diupdate!',
            'data'    => [
                'id_user' => $user->id,
            ]
        ]);
    }
    
    public function actionCreatePPDS() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (
            !isset($post['id_client']) ||
            !isset($post['display_name']) ||
            !isset($post['username']) ||
            !isset($post['email']) ||
            !isset($post['phone']) ||
            !isset($post['password']) ||
            !isset($post['confirm_password'])
        ) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }

        $password         = $post['password'];
        $confirm_password = $post['confirm_password'];

        if ($password !== $confirm_password) {
            echo json_encode([
                'status' => false,
                'message' => 'Password not match!'
            ]);
            Yii::app()->end();
        }
        
        $role = MRole::model()->findByAttributes(
                    [
                        'id_client' => $post['id_client'],
                        'name'      => 'ppds'
                    ],
                    ['select' => 'id']
            );
        
        try {
            $user                 = new MUser;
            $user->id_client      = $post['id_client'];
            $user->id_role        = $role->id;
            $user->display_name   = $post['display_name'];
            $user->username       = $post['username'];
            $user->email          = $post['email'];
            $user->phone          = $post['phone'];
            $user->address        = $post['address'] ?? null;
            $user->date_of_birth  = $post['date_of_birth'] ?? null;
            $user->code           = $post['nim'] ?? null;
            $user->password       = password_hash($post['password'], PASSWORD_BCRYPT);
            $user->created_date   = date('Y-m-d H:i:s');
            $user->save(false);
        
            echo json_encode([
                'status'  => true,
                'message' => 'Data berhasil dibuat!',
            ]);
        } catch (Exception $e) {
            echo json_encode([
                'status'  => false,
                'message' => $e->getMessage()
            ]);
        }
        Yii::app()->end();
    }
    
    public function actionGetListPPDSLogbook() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);

        if (!isset($post['id_client'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }

        // pagination default
        $page  = isset($post['page']) ? (int)$post['page'] : 1;
        $limit = isset($post['limit']) ? (int)$post['limit'] : 10;
        $offset = ($page - 1) * $limit;

        // sorting (default DESC)
        $sort = (isset($post['sort']) && strtolower($post['sort']) === 'asc') ? 'ASC' : 'DESC';

        $sql = 'SELECT
                    tl.id,
                    tl.date,
                    tl.title,
                    tl.notes,
                    tl.verified_status,
                    mu.display_name AS ppds_name,
                    mu.code AS nim,
                    ma.name AS action,
                    mh.name AS hospital,
                    ms.name AS semester,
                    st.name AS stase_name,
                    tls.display_name AS staff_name
                FROM t_logbook tl
                LEFT JOIN m_user mu ON tl.id_user = mu.id
                LEFT JOIN m_action ma ON tl.id_action = ma.id
                LEFT JOIN m_hospital mh ON tl.id_hospital = mh.id
                LEFT JOIN m_semester ms ON tl.id_semester = ms.id
                LEFT JOIN m_stase st ON tl.id_stase = st.id
                LEFT JOIN LATERAL (
                    SELECT tls.id_logbook, mu.display_name, tls.id_user
                    FROM t_logbook_status tls
                    JOIN m_action_role mar ON tls.id_action_role = mar.id
                    JOIN m_user mu ON tls.id_user = mu.id
                    WHERE tls.id_logbook = tl.id
                    AND mar.role != :role_action
                    LIMIT 1
                ) tls ON true
                WHERE
                    tl.id_client = :id_client
                AND tl.deleted_at IS NULL';

        $countSql = 'SELECT COUNT(*)
                    FROM t_logbook tl
                    WHERE
                        tl.id_client = :id_client
                    AND tl.deleted_at IS NULL';

        $params = [
            ':id_client' => $post['id_client'],
            ':role_action' => 'Peserta'
        ];

        // optional filter
        if (!empty($post['id_ppds'])) {
            $sql      .= ' AND tl.id_user = :id_ppds';
            $countSql .= ' AND tl.id_user = :id_ppds';
            $params[':id_ppds'] = $post['id_ppds'];
        }

        if (!empty($post['id_staff'])) {
            $sql      .= ' AND tls.id_user = :id_staff';
            $countSql .= ' AND tls.id_user = :id_staff';
            $params[':id_staff'] = $post['id_staff'];
        }

        if (!empty($post['id_activity'])) {
            $sql      .= ' AND tl.id_action = :id_activity';
            $countSql .= ' AND tl.id_action = :id_activity';
            $params[':id_activity'] = $post['id_activity'];
        }

        if (!empty($post['id_stase'])) {
            $sql      .= ' AND tl.id_stase = :id_stase';
            $countSql .= ' AND tl.id_stase = :id_stase';
            $params[':id_stase'] = $post['id_stase'];
        }

        if (!empty($post['start_date'])) {
            $sql      .= ' AND tl.date >= :start_date';
            $countSql .= ' AND tl.date >= :start_date';
            $params[':start_date'] = $post['start_date'];
        }

        if (!empty($post['end_date'])) {
            $sql      .= ' AND tl.date <= :end_date';
            $countSql .= ' AND tl.date <= :end_date';
            $params[':end_date'] = $post['end_date'];
        }

        if (!empty($post['status'])) {
            $sql      .= ' AND tl.verified_status = :status';
            $countSql .= ' AND tl.verified_status = :status';
            $params[':status'] = $post['status'];
        }

        // sorting + pagination
        $sql .= " ORDER BY
                    tl.date
                    $sort
                LIMIT :limit
                OFFSET :offset";

        $command      = Yii::app()->db->createCommand($sql);
        $countCommand = Yii::app()->db->createCommand($countSql);

        foreach ($params as $key => $val) {
            $command->bindValue($key, $val);
            // $countCommand->bindValue($key, $val);
            if ($key !== ':role_action') {
                $countCommand->bindValue($key, $val);
            }
        }

        $command->bindValue(':limit', $limit, PDO::PARAM_INT);
        $command->bindValue(':offset', $offset, PDO::PARAM_INT);

        $res   = $command->queryAll();
        $total = $countCommand->queryScalar();

        echo json_encode([
            'status' => true,
            'total'  => (int)$total,
            'data'   => $res,
            'pagination' => [
                'page'   => $page,
                'limit'  => $limit,
            ]
        ]);
    }

    public function actionGetDetailPPDSLogbook() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);

        if (!isset($post['id_logbook'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }

        $sql = 'SELECT
                    tl.id,
                    tl.date,
                    tl.notes,
                    tl.verified_status,
                    mu.display_name AS ppds_name,
                    mu.code AS nim,
                    mu.inisial_code,
                    ma.name AS action,
                    mh.name AS hospital,
                    tls.display_name AS staff_name
                FROM t_logbook tl
                LEFT JOIN m_user mu ON tl.id_user = mu.id
                LEFT JOIN m_action ma ON tl.id_action = ma.id
                LEFT JOIN m_hospital mh ON tl.id_hospital = mh.id
                LEFT JOIN m_stase st ON tl.id_stase = st.id
                LEFT JOIN LATERAL (
                    SELECT tls.id_logbook, mu.display_name, tls.id_user
                    FROM t_logbook_status tls
                    JOIN m_action_role mar ON tls.id_action_role = mar.id
                    JOIN m_user mu ON tls.id_user = mu.id
                    WHERE tls.id_logbook = tl.id
                    AND mar.role != :role_action
                    LIMIT 1
                ) tls ON true
                WHERE
                    tl.id = :id_logbook';

        $res = Yii::app()->db->createCommand($sql)
            ->bindValue(':id_logbook', $post['id_logbook'])
            ->bindValue(':role_action', 'Peserta')
            ->queryRow();

        if (!$res) {
            echo json_encode([
                'status'  => false,
                'message' => 'Logbook tidak ditemukan!'
            ]);
            Yii::app()->end();
        }
        
        echo json_encode([
            'status'  => true,
            'data'    => $res
        ]);
    }

    public function actionGetListPPDSInactive() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (!isset($post['id_client'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }
    
        // pagination default
        $page  = isset($post['page']) ? (int)$post['page'] : 1;
        $limit = isset($post['limit']) ? (int)$post['limit'] : 10;
        $offset = ($page - 1) * $limit;
    
        // sorting (default ASC)
        $sort = (isset($post['sort']) && strtolower($post['sort']) === 'desc') ? 'DESC' : 'ASC';
    
        $sql = 'SELECT
                    mu.id,
                    mu.display_name,
                    mu.username,
                    mu.email,
                    mu.phone,
                    mu.address,
                    mu.date_of_birth,
                    mu.code AS nim,
                    mr.name AS role_name,
                    ms.name AS stase_name,
                    (
                        SELECT COUNT(*)
                        FROM t_logbook tl
                        WHERE 
                            tl.id_user = mu.id
                        AND tl.deleted_at IS NULL
                    ) AS total_logbook
                FROM m_user mu
                LEFT JOIN m_role mr ON mr.id = mu.id_role
                LEFT JOIN m_stase ms ON ms.id = mu.id_stase
                WHERE 
                    mu.id_client  = :id_client
                AND mu.status     = :status
                -- AND mu.is_show    = :is_show
                AND mu.deleted_at IS NULL
                AND mr.name       = :role_name';
        
        $countSql = 'SELECT COUNT(*)
                    FROM m_user mu
                    LEFT JOIN m_role mr ON mr.id = mu.id_role
                    LEFT JOIN m_stase ms ON ms.id = mu.id_stase
                    WHERE 
                        mu.id_client  = :id_client
                    AND mu.status     = :status
                    -- AND mu.is_show    = :is_show
                    AND mu.deleted_at IS NULL
                    AND mr.name       = :role_name';
    
        $params = [
            ':id_client' => $post['id_client'],
            ':status'    => 'Inactive',
            // ':is_show'   => true,
            ':role_name' => 'ppds'
        ];
    
        // 🔥 optional filter
        if (!empty($post['ppds'])) {
            $sql      .= ' AND mu.id = :ppds';
            $countSql .= ' AND mu.id = :ppds';
            $params[':ppds'] = $post['ppds'];
        }
    
        if (!empty($post['stase'])) {
            $sql      .= ' AND mu.id_stase = :stase';
            $countSql .= ' AND mu.id_stase = :stase';
            $params[':stase'] = $post['stase'];
        }
    
        if (!empty($post['nim'])) {
            $sql      .= ' AND mu.code ILIKE :nim';
            $countSql .= ' AND mu.code ILIKE :nim';
            $params[':nim'] = '%' . $post['nim'] . '%';
        }
    
        // sorting + pagination
        $sql .= " ORDER BY 
                    mu.display_name 
                    $sort 
                LIMIT :limit 
                OFFSET :offset";
    
        $command      = Yii::app()->db->createCommand($sql);
        $countCommand = Yii::app()->db->createCommand($countSql);
        
        foreach ($params as $key => $val) {
            $command->bindValue($key, $val);
            $countCommand->bindValue($key, $val);
        }
    
        $command->bindValue(':limit', $limit, PDO::PARAM_INT);
        $command->bindValue(':offset', $offset, PDO::PARAM_INT);
    
        $res   = $command->queryAll();
        $total = $countCommand->queryScalar();
    
        echo json_encode([
            'status' => true,
            'total'  => (int)$total,
            'data'   => $res,
            'pagination' => [
                'page'   => $page,
                'limit'  => $limit,
            ]
        ]);
    }
    // === PPDS STAGE ===



    // === PENILAIAN LOGBOOK STAGE ===
    public function actionGetListPenilaianLogbook() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (!isset($post['id_client'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }

        $sql = 'SELECT
                    ma.id,
                    ma.name,
                    COUNT(*) FILTER (WHERE tla.id_logbook IS NULL) AS unscored,
                    COUNT(*) FILTER (WHERE tla.id_logbook IS NOT NULL) AS scored
                FROM t_logbook tl
                JOIN m_action ma
                    ON ma.id = tl.id_action
                LEFT JOIN m_action_category mac
                    ON mac.id = tl.id_category
                LEFT JOIN (
                    SELECT DISTINCT id_logbook
                    FROM t_logbook_asm
                ) tla
                    ON tla.id_logbook = tl.id
                WHERE
                    tl.deleted_at IS NULL
                    AND tl.id_client = :id_client
                    AND ma.has_score = :has_score
                    AND ma.has_score_option = :has_score_option
                    AND COALESCE(mac.required_asm, TRUE) = :required_asm
                GROUP BY
                    ma.id,
                    ma.name
                ORDER BY
                    ma.name ASC';
                    
        $res = Yii::app()->db->createCommand($sql)
            ->bindValue(':id_client', $post['id_client'])
            ->bindValue(':has_score', true)
            ->bindValue(':has_score_option', true)
            ->bindValue(':required_asm', true)
            ->queryAll();

        echo json_encode([
            'status'  => true,
            'data'    => $res
        ]);
    }

    public function actionGetDetailPenilaianLogbook() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);
        
        if (!isset($post['id_action'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }

        $sql = 'SELECT
                    ma.id,
                    ma.name,
                    COUNT(*) FILTER (WHERE tla.id_logbook IS NULL) AS unscored,
                    COUNT(*) FILTER (WHERE tla.id_logbook IS NOT NULL) AS scored
                FROM t_logbook tl
                JOIN m_action ma
                    ON ma.id = tl.id_action
                LEFT JOIN m_action_category mac
                    ON mac.id = tl.id_category
                LEFT JOIN (
                    SELECT DISTINCT id_logbook
                    FROM t_logbook_asm
                ) tla
                    ON tla.id_logbook = tl.id
                WHERE
                    tl.deleted_at IS NULL
                    AND ma.id = :id_action
                    AND ma.has_score = :has_score
                    AND ma.has_score_option = :has_score_option
                    AND COALESCE(mac.required_asm, TRUE) = :required_asm
                GROUP BY
                    ma.id,
                    ma.name
                ORDER BY
                    ma.name ASC';
                    
        $res = Yii::app()->db->createCommand($sql)
            ->bindValue(':id_action', $post['id_action'])
            ->bindValue(':has_score', true)
            ->bindValue(':has_score_option', true)
            ->bindValue(':required_asm', true)
            ->queryRow();

        echo json_encode([
            'status'  => true,
            'data'    => $res
        ]);
    }
    // === PENILAIAN LOGBOOK STAGE ===

    

    // === DASHBOARD ===
    public function actionGetDashboard() {
        $rest_json = file_get_contents("php://input");
        $post = json_decode($rest_json, true);

        if (!isset($post['id_client'])) {
            echo json_encode([
                'status' => false,
                'message' => 'Invalid parameter!'
            ]);
            Yii::app()->end();
        }

        $id_client = $post['id_client'];
        $response = [];

        // dashboard1: ProfileCard / client info
        $sql_client = 'SELECT id, name FROM m_client WHERE id = :id_client';
        $client = Yii::app()->db->createCommand($sql_client)
            ->bindValue(':id_client', $id_client)
            ->queryRow();
        $response['dashboard1'] = [
            'client' => $client['name'] ?? '',
        ];

        // dashboard2: StatCards / counts (ppds, staff, action, stage, logbook)
        $sql_users = 'SELECT
                        mr.name as role_name,
                        mu.status,
                        COUNT(*) as total
                      FROM m_user mu
                      JOIN m_role mr ON mu.id_role = mr.id
                      WHERE mu.id_client = :id_client
                        AND mu.deleted_at IS NULL
                        AND mr.name IN (\'ppds\', \'staff\')
                      GROUP BY mr.name, mu.status';
        $users = Yii::app()->db->createCommand($sql_users)
            ->bindValue(':id_client', $id_client)
            ->queryAll();

        $total_ppds_active = 0;
        $total_ppds_inactive = 0;
        $total_staff = 0;

        foreach ($users as $u) {
            if ($u['role_name'] === 'ppds') {
                if ($u['status'] === 'Active') {
                    $total_ppds_active = (int)$u['total'];
                } else if ($u['status'] === 'Inactive') {
                    $total_ppds_inactive = (int)$u['total'];
                }
            } else if ($u['role_name'] === 'staff') {
                $total_staff = (int)$u['total'];
            }
        }

        $sql_actions = 'SELECT COUNT(*) as total FROM m_action WHERE id_client = :id_client';
        $actions = Yii::app()->db->createCommand($sql_actions)
            ->bindValue(':id_client', $id_client)
            ->queryRow();

        $sql_stages = 'SELECT COUNT(*) as total FROM m_stage WHERE id_client = :id_client';
        $stages = Yii::app()->db->createCommand($sql_stages)
            ->bindValue(':id_client', $id_client)
            ->queryRow();

        $sql_logbooks = 'SELECT
                            COUNT(*) as total_logbook,
                            SUM(CASE WHEN verified_status = \'verified\' THEN 1 ELSE 0 END) as total_verified,
                            SUM(CASE WHEN verified_status = \'rejected\' THEN 1 ELSE 0 END) as total_rejected,
                            SUM(CASE WHEN verified_status = \'revised\' THEN 1 ELSE 0 END) as total_revised,
                            SUM(CASE WHEN verified_status = \'pending\' THEN 1 ELSE 0 END) as total_pending
                         FROM t_logbook tl
                         JOIN m_action ma ON tl.id_action = ma.id
                         WHERE tl.id_client = :id_client
                           AND tl.deleted_at IS NULL
                           AND ma.identifier != \'stase\'';
        $logbooks = Yii::app()->db->createCommand($sql_logbooks)
            ->bindValue(':id_client', $id_client)
            ->queryRow();

        $total_logbook = (int)$logbooks['total_logbook'];
        $total_verified = (int)$logbooks['total_verified'];
        $total_rejected = (int)$logbooks['total_rejected'];
        $total_revised = (int)$logbooks['total_revised'];
        $total_pending = (int)$logbooks['total_pending'];

        $response['dashboard2'] = [
            'ppds' => [
                'active' => $total_ppds_active,
                'inactive' => $total_ppds_inactive,
            ],
            'staff' => $total_staff,
            'action' => (int)$actions['total'],
            'stage' => (int)$stages['total'],
            'logbook' => $total_logbook,
            'verified' => $total_verified,
            'rejected' => $total_rejected,
            'revised' => $total_revised,
            'pending' => $total_pending,
            'percentage' => $total_logbook > 0 ? [
                'verified' => round(($total_verified / $total_logbook) * 100, 2) . '%',
                'rejected' => round(($total_rejected / $total_logbook) * 100, 2) . '%',
                'revised' => round(($total_revised / $total_logbook) * 100, 2) . '%',
                'pending' => round(($total_pending / $total_logbook) * 100, 2) . '%',
            ] : [
                'verified' => '0%',
                'rejected' => '0%',
                'revised' => '0%',
                'pending' => '0%',
            ],
        ];

        // dashboard3: LogActivity / notifications
        $sql_notif = 'SELECT id, title, message, date, is_read
                      FROM t_notif
                      WHERE id_client = :id_client
                      ORDER BY date DESC
                      LIMIT 10';
        $notifs = Yii::app()->db->createCommand($sql_notif)
            ->bindValue(':id_client', $id_client)
            ->queryAll();
        $response['dashboard3'] = $notifs;

        // dashboard4: WaitingVerification / todo list
        $current_month = date('n');
        $current_year = date('Y');
        $month_start = $current_year . '-' . str_pad($current_month, 2, '0', STR_PAD_LEFT) . '-01';

        $sql_todo = 'SELECT DISTINCT
                        lb.id,
                        lb.id_action,
                        ma.name as action_name,
                        mu.display_name as ppds_name,
                        lb.date,
                        lb.id_category,
                        (
                            SELECT mu2.display_name
                            FROM t_logbook_status tls
                            JOIN m_user mu2 ON tls.id_user = mu2.id
                            WHERE tls.id_logbook = lb.id
                              AND tls.status IN (\'pending\', \'revised\')
                            ORDER BY tls.date_time DESC
                            LIMIT 1
                        ) as staff_name
                     FROM t_logbook lb
                     JOIN m_action ma ON lb.id_action = ma.id
                     JOIN m_user mu ON lb.id_user = mu.id
                     JOIN t_logbook_status tls ON lb.id = tls.id_logbook
                     WHERE lb.id_client = :id_client
                       AND lb.deleted_at IS NULL
                       AND tls.deleted_at IS NULL
                       AND tls.status IN (\'pending\', \'revised\')
                       AND tls.date_time >= :month_start
                     ORDER BY lb.date DESC';
        $todos = Yii::app()->db->createCommand($sql_todo)
            ->bindValue(':id_client', $id_client)
            ->bindValue(':month_start', $month_start)
            ->queryAll();
        $response['dashboard4'] = $todos;

        // dashboard5: PPDSPerStase
        $sql_ppds_stase = 'SELECT
                              ms.name as stase_name,
                              mu.id,
                              mu.display_name
                           FROM m_user mu
                           JOIN m_role mr ON mu.id_role = mr.id
                           LEFT JOIN m_stase ms ON mu.id_stase = ms.id
                           WHERE mu.id_client = :id_client
                             AND mu.deleted_at IS NULL
                             AND mu.is_show = true
                             AND mr.name = \'ppds\'';
        $all_ppds = Yii::app()->db->createCommand($sql_ppds_stase)
            ->bindValue(':id_client', $id_client)
            ->queryAll();

        $stase_ppds = [];
        foreach ($all_ppds as $ppds) {
            if (!empty($ppds['stase_name'])) {
                if (!isset($stase_ppds[$ppds['stase_name']])) {
                    $stase_ppds[$ppds['stase_name']] = [];
                }
                $stase_ppds[$ppds['stase_name']][] = [
                    'id' => $ppds['id'],
                    'display_name' => $ppds['display_name']
                ];
            }
        }
        $response['dashboard5'] = $stase_ppds;

        // dashboard6: PPDSPerStage
        $sql_ppds_stage = 'SELECT
                              mst.name as stage_name,
                              mu.id,
                              mu.display_name
                           FROM m_user mu
                           JOIN m_role mr ON mu.id_role = mr.id
                           LEFT JOIN m_stase ms ON mu.id_stase = ms.id
                           LEFT JOIN m_stage mst ON ms.id_stage = mst.id
                           WHERE mu.id_client = :id_client
                             AND mu.deleted_at IS NULL
                             AND mu.is_show = true
                             AND mr.name = \'ppds\'';
        $all_ppds_stage = Yii::app()->db->createCommand($sql_ppds_stage)
            ->bindValue(':id_client', $id_client)
            ->queryAll();

        $stage_ppds = [];
        foreach ($all_ppds_stage as $ppds) {
            if (!empty($ppds['stage_name'])) {
                if (!isset($stage_ppds[$ppds['stage_name']])) {
                    $stage_ppds[$ppds['stage_name']] = [];
                }
                $stage_ppds[$ppds['stage_name']][] = [
                    'id' => $ppds['id'],
                    'display_name' => $ppds['display_name']
                ];
            }
        }
        $response['dashboard6'] = $stage_ppds;

        // dashboard7: KinerjaDPJP / staff performance
        $sql_staff_perf = 'SELECT
                              mu.id,
                              mu.display_name,
                              mu.picture,
                              COUNT(CASE WHEN tls.status = \'verified\' THEN 1 END) as verified_count,
                              COUNT(CASE WHEN tls.status = \'pending\' THEN 1 END) as pending_count,
                              COUNT(*) as total_count,
                              CASE
                                  WHEN COUNT(*) = 0 THEN 0
                                  ELSE ROUND(COUNT(CASE WHEN tls.status = \'verified\' THEN 1 END)::numeric / COUNT(*), 2)
                              END as rank
                           FROM m_user mu
                           JOIN m_role mr ON mu.id_role = mr.id
                           LEFT JOIN t_logbook_status tls ON mu.id = tls.id_user
                           LEFT JOIN t_logbook lb ON tls.id_logbook = lb.id
                           WHERE mu.id_client = :id_client
                             AND mu.deleted_at IS NULL
                             AND mu.is_show = true
                             AND mr.name = \'staff\'
                             AND tls.deleted_at IS NULL
                             AND tls.date_time >= :month_start
                           GROUP BY mu.id, mu.display_name, mu.picture
                           ORDER BY rank DESC, verified_count DESC';
        $staff_perf = Yii::app()->db->createCommand($sql_staff_perf)
            ->bindValue(':id_client', $id_client)
            ->bindValue(':month_start', $month_start)
            ->queryAll();
        $response['dashboard7'] = $staff_perf;

        // dashboard8: KinerjaPPDS / ppds performance
        $sql_ppds_perf = 'SELECT
                              mu.id,
                              mu.display_name,
                              mu.picture,
                              ms.name as stase_name,
                              COUNT(*) as verified_count
                           FROM m_user mu
                           JOIN m_role mr ON mu.id_role = mr.id
                           LEFT JOIN m_stase ms ON mu.id_stase = ms.id
                           LEFT JOIN t_logbook lb ON mu.id = lb.id_user
                           LEFT JOIN m_action ma ON lb.id_action = ma.id
                           WHERE mu.id_client = :id_client
                             AND mu.deleted_at IS NULL
                             AND mu.is_show = true
                             AND mr.name = \'ppds\'
                             AND lb.deleted_at IS NULL
                             AND lb.verified_status = \'verified\'
                             AND ma.identifier != \'stase\'
                             AND lb.date >= :month_start
                           GROUP BY mu.id, mu.display_name, mu.picture, ms.name
                           ORDER BY verified_count DESC';
        $ppds_perf = Yii::app()->db->createCommand($sql_ppds_perf)
            ->bindValue(':id_client', $id_client)
            ->bindValue(':month_start', $month_start)
            ->queryAll();
        $response['dashboard8'] = $ppds_perf;

        // dashboard9: LogbookByStatusChart (sama dengan dashboard2 tapi breakdown)
        $response['dashboard9'] = [
            'total' => $total_logbook,
            'verified' => $total_verified,
            'rejected' => $total_rejected,
            'revised' => $total_revised,
            'pending' => $total_pending,
            'percentage' => $total_logbook > 0 ? [
                'verified' => round(($total_verified / $total_logbook) * 100, 2) . '%',
                'rejected' => round(($total_rejected / $total_logbook) * 100, 2) . '%',
                'revised' => round(($total_revised / $total_logbook) * 100, 2) . '%',
                'pending' => round(($total_pending / $total_logbook) * 100, 2) . '%',
            ] : [
                'verified' => '0%',
                'rejected' => '0%',
                'revised' => '0%',
                'pending' => '0%',
            ],
        ];

        echo json_encode([
            'status' => true,
            'data' => $response
        ]);
    }
}