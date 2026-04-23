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
    
    
    
    // === MASTER STAGE ===
    
    // option : ppds (Active) | staff
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
                AND mr.name       = :role_name';
        
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
                    ms.id_client = :id_client';
        
        $res = Yii::app()->db->createCommand($sql)
            ->bindValue(':id_client', $post['id_client'])
            ->queryAll();
        
        echo json_encode([
            'status'  => true,
            'total'   => count($res),
            'data'    => $res
        ]);
    }
    
    public function actionGetPengajarMaster() {
        
    }
    
    public function actionGetActivityMaster() {
        
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
                        WHERE tl.id_user = mu.id
                    ) AS total_logbook
                FROM m_user mu
                LEFT JOIN m_role mr ON mr.id = mu.id_role
                LEFT JOIN m_stase ms ON ms.id = mu.id_stase
                WHERE 
                    mu.id_client  = :id_client
                AND mu.status     = :status
                AND mu.is_show    = :is_show
                AND mu.deleted_at IS NULL';
        
        $countSql = 'SELECT COUNT(*)
                    FROM m_user mu
                    LEFT JOIN m_role mr ON mr.id = mu.id_role
                    LEFT JOIN m_stase ms ON ms.id = mu.id_stase
                    WHERE 
                        mu.id_client  = :id_client
                    AND mu.status     = :status
                    AND mu.is_show    = :is_show
                    AND mu.deleted_at IS NULL';
    
        $params = [
            ':id_client' => $post['id_client'],
            ':status'    => 'Active',
            ':is_show'   => true
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
                        WHERE tl.id_user = mu.id
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

}