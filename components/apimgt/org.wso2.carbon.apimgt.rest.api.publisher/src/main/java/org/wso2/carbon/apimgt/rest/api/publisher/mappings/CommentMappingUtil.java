/*
 *   Copyright (c) 2018, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 *   WSO2 Inc. licenses this file to you under the Apache License,
 *   Version 2.0 (the "License"); you may not use this file except
 *   in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an
 *  "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 *  KIND, either express or implied.  See the License for the
 *  specific language governing permissions and limitations
 *  under the License.
 *
 */
package org.wso2.carbon.apimgt.rest.api.publisher.mappings;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.wso2.carbon.apimgt.core.exception.APIManagementException;
import org.wso2.carbon.apimgt.core.impl.APIManagerFactory;
import org.wso2.carbon.apimgt.core.models.Comment;
import org.wso2.carbon.apimgt.rest.api.publisher.dto.CommentDTO;
import org.wso2.carbon.apimgt.rest.api.publisher.dto.CommentListDTO;


import java.util.ArrayList;
import java.util.List;

/**
 * Mapping class for Comment Object and Comment List object to DTO and vise-versa
 *
 */
public class CommentMappingUtil {

    private static final Logger log = LoggerFactory.getLogger(CommentMappingUtil.class);

    /**
     * Converts a Comment object into corresponding REST API CommentDTO object
     *
     * @param comment comment object
     * @return CommentDTO
     */
    public static CommentDTO fromCommentToDTO(Comment comment) throws APIManagementException {

        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setCommentId(comment.getUuid());
        String realName = APIManagerFactory.getInstance().getUserNameMapper().getLoggedInUserIDFromPseudoName(comment
                .getCommentedUser());
        commentDTO.setUsername(realName);
        commentDTO.setCommentText(comment.getCommentText());
        commentDTO.setCategory(comment.getCategory());
        commentDTO.setParentCommentId(comment.getParentCommentId());
        commentDTO.setEntryPoint(comment.getEntryPoint());
        commentDTO.setCreatedBy(comment.getCreatedUser());
        commentDTO.setLastUpdatedBy(comment.getUpdatedUser());
        commentDTO.setCreatedTime(comment.getCreatedTime().toString());
        commentDTO.setLastUpdatedTime(comment.getUpdatedTime().toString());

        return commentDTO;
    }

    /**
     * Converts a CommentDTO to a Comment object
     *
     * @param body commentDTO body
     * @param username username of the consumer
     * @return Comment object
     */
    public static Comment fromDTOToComment(CommentDTO body, String username) {

        Comment comment = new Comment();
        comment.setCommentText(body.getCommentText());
        comment.setCategory(body.getCategory());
        comment.setParentCommentId(body.getParentCommentId());
        comment.setEntryPoint(body.getEntryPoint());
        comment.setCommentedUser(username);
        comment.setApiId(body.getApiId());
        comment.setCreatedUser(username);
        comment.setUpdatedUser(username);

        return comment;
    }

    /**
     * Wraps a List of Comments to a CommentListDTO
     *
     * @param commentList list of comments
     * @param limit maximum comments to return
     * @param offset  starting position of the pagination
     * @return CommentListDTO
     */
    public static CommentListDTO fromCommentListToDTO(List<Comment> commentList, int limit, int offset) {
        CommentListDTO commentListDTO = new CommentListDTO();
        List<CommentDTO> listOfCommentDTOs = new ArrayList<>();
        commentListDTO.setCount(commentList.size());

        int start = offset < commentList.size() && offset >= 0 ? offset : Integer.MAX_VALUE;
        int end = offset + limit - 1 <= commentList.size() - 1 ? offset + limit - 1 : commentList.size() - 1;

        for (int i = start; i <= end; i++) {
            try {
                listOfCommentDTOs.add(fromCommentToDTO(commentList.get(i)));
            } catch (APIManagementException e) {
                // This not to throw as this have comment list
                log.error("Error while Retrieving RealName from PseudoName", e);
            }
        }
        commentListDTO.setList(listOfCommentDTOs);
        return commentListDTO;
    }
}
