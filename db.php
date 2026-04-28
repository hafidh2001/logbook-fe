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
}